import prisma from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { sendEmail } from '../../config/email.js';
import { getOrderConfirmationEmailTemplate } from '../../utils/emailTemplates.js';

export const createOrder = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items,
      total,
      paymentMethod,
      discountCode,
      couponCode,
      idempotencyKey,
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !customerAddress || !items || !Array.isArray(items) || items.length === 0) {
      return sendError(res, 400, 'Missing required order fields');
    }

    const cleanCustomerPhone = (customerPhone || '').toString().trim().replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanCustomerPhone)) {
      return sendError(res, 400, 'Enter a valid 10-digit mobile number');
    }

    // Idempotency check: if idempotencyKey is supplied and order exists, return existing order
    if (idempotencyKey) {
      const existingOrder = await prisma.order.findUnique({
        where: { idempotencyKey: String(idempotencyKey) },
      });
      if (existingOrder) {
        return sendSuccess(res, 200, { order: existingOrder }, 'Order retrieved (idempotent)');
      }
    }

    // 1. Compute real subtotal server-side by fetching Product prices from DB
    let calculatedSubtotal = 0;
    const processedItems = [];
    const soldOutItems = [];

    for (const item of items) {
      if (!item.id) {
        return sendError(res, 400, 'Invalid product item format');
      }

      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });

      if (!product) {
        return sendError(res, 400, `Product with id ${item.id} not found`);
      }

      if (product.isSoldOut) {
        soldOutItems.push(product.name);
      }

      // Determine actual current price
      let itemPrice;
      if (product.salePrice !== undefined && product.salePrice !== null) {
        itemPrice = Number(product.salePrice);
      } else if (product.price !== undefined && product.price !== null) {
        itemPrice = Number(product.price);
      } else if (product.originalPrice !== undefined && product.originalPrice !== null) {
        itemPrice = Number(product.originalPrice);
      } else {
        itemPrice = Number(item.price) || 0;
      }

      const quantity = Math.max(1, Number(item.quantity) || 1);
      calculatedSubtotal += itemPrice * quantity;

      // Capture product image snapshot at moment of purchase
      let itemImage = item.image || item.secondaryImage || null;
      if (product) {
        if (item.color && Array.isArray(product.colorVariants)) {
          const colorStr = typeof item.color === 'object' ? item.color.name : String(item.color);
          const matchedVariant = product.colorVariants.find(
            (v) => v && v.name && v.name.toLowerCase() === colorStr.toLowerCase()
          );
          if (matchedVariant && Array.isArray(matchedVariant.images) && matchedVariant.images.length > 0) {
            itemImage = matchedVariant.images[0];
          }
        }
        if (!itemImage) {
          itemImage = product.image || product.secondaryImage || itemImage || null;
        }
      }

      processedItems.push({
        ...item,
        price: itemPrice,
        quantity,
        image: itemImage || item.image || null,
      });
    }

    if (soldOutItems.length > 0) {
      return sendError(
        res,
        400,
        `The following item(s) are sold out and unavailable for purchase: ${soldOutItems.join(', ')}`
      );
    }

    // 2. Server-side discount re-validation
    let discountAmount = 0;
    const codeToValidate = (discountCode || couponCode || '').toString().trim().toUpperCase();

    if (codeToValidate) {
      const discount = await prisma.discountCode.findUnique({
        where: { code: codeToValidate },
      });

      if (discount && discount.isActive && calculatedSubtotal >= discount.minSpend) {
        discountAmount = Math.round((calculatedSubtotal * discount.discountPercent) / 100);
      }
    }

    // 3. Shipping Fee calculation
    const storeSettings = await prisma.storeSettings.findFirst();
    const configuredShippingFee = storeSettings?.shippingFee ?? 250;
    const configuredFreeThreshold = storeSettings?.freeShippingThreshold ?? 5000;

    const subtotalAfterDiscount = calculatedSubtotal - discountAmount;
    const shippingFee = subtotalAfterDiscount >= configuredFreeThreshold ? 0 : configuredShippingFee;

    const serverComputedTotal = Math.max(0, Math.round(subtotalAfterDiscount + shippingFee));

    // 4. Warning check for client total discrepancy
    if (total !== undefined && total !== null && total !== '') {
      const clientTotal = Number(total);
      if (Math.abs(clientTotal - serverComputedTotal) > 1) {
        console.warn(
          `[SECURITY WARNING] Client-sent total (${clientTotal}) differs from server-computed total (${serverComputedTotal}). Order total set to server-computed amount.`
        );
      }
    }

    const methodStr = (paymentMethod || '').toLowerCase();
    const isCOD = methodStr.includes('cash on delivery') || methodStr.includes('cod');
    const initialStatus = isCOD ? 'Processing' : 'Pending';
    const now = new Date().toISOString();

    let order;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      attempts++;
      const timeComponent = Date.now().toString().slice(-6);
      const randomComponent = Math.floor(100000 + Math.random() * 900000);
      const id = `ORD-${timeComponent}${randomComponent}`;

      try {
        order = await prisma.order.create({
          data: {
            id,
            userId,
            customerName,
            customerEmail,
            customerPhone,
            customerAddress,
            items: processedItems,
            total: serverComputedTotal,
            status: initialStatus,
            statusHistory: [{ status: initialStatus, timestamp: now }],
            paymentMethod: paymentMethod || 'Prepaid (UPI / Card)',
            idempotencyKey: idempotencyKey ? String(idempotencyKey) : null,
          },
        });
        break;
      } catch (dbErr) {
        if (dbErr.code === 'P2002' && attempts < maxAttempts) {
          console.warn(`[ORDER ID COLLISION] Retrying order ID generation (attempt ${attempts + 1})...`);
          continue;
        }
        throw dbErr;
      }
    }

    // Clear cart ONLY for Cash on Delivery orders upon creation.
    if (userId && isCOD) {
      await prisma.cartItem.deleteMany({ where: { userId } });
    }

    // Send order confirmation email for COD orders (fire-and-forget)
    if (isCOD && order.customerEmail) {
      const { html, text } = getOrderConfirmationEmailTemplate({ order });
      sendEmail({
        to: order.customerEmail,
        subject: `Order Confirmation - ${order.id} | SURANGHI NAAR`,
        html,
        text,
      }).catch((err) => console.error('COD order email error:', err));
    }

    return sendSuccess(res, 201, { order }, 'Order created successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: {
        userId,
        NOT: {
          AND: [
            { status: 'Pending' },
            { paymentMethod: { contains: 'Prepaid' } },
          ],
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, 200, { orders }, 'Orders fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 403, 'Forbidden: You do not have access to this order');
    }

    return sendSuccess(res, 200, { order }, 'Order details fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const cancelUserOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { reason, cancellationReason } = req.body;

    const finalReason = (reason || cancellationReason || 'Cancelled by customer').toString().trim();

    // Secure ownership check using findFirst with id + userId
    const order = await prisma.order.findFirst({
      where: { id, userId },
    });

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    const cancellableStatuses = ['Pending', 'Processing'];
    if (!cancellableStatuses.includes(order.status)) {
      return sendError(res, 400, 'This order can no longer be cancelled');
    }

    const now = new Date().toISOString();
    const currentHistory = Array.isArray(order.statusHistory) ? order.statusHistory : [];
    const refundRequired = Boolean(order.razorpayPaymentId);

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: 'Cancelled',
        refundRequired,
        cancellationReason: finalReason,
        statusHistory: [
          ...currentHistory,
          { status: 'Cancelled', timestamp: now, reason: finalReason },
        ],
      },
    });

    return sendSuccess(res, 200, { order: updatedOrder }, 'Order cancelled successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
