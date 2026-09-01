import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma, { isPrismaFatalError, withQueryTimeout } from '../../config/db.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import {
  adminLoginSchema,
  productSchema,
  categorySchema,
  heroSlideSchema,
  promoMessageSchema,
  discountCodeSchema,
  storeSettingsSchema,
} from './admin.schema.js';

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = adminLoginSchema.parse(req.body);

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    const cleanEmail = email.trim().toLowerCase();

    // Look up the admin user by EXACT email match only (case-insensitive) with 8s timeout
    let adminUser;
    try {
      adminUser = await withQueryTimeout(
        () => prisma.user.findFirst({
          where: {
            role: 'admin',
            email: { equals: cleanEmail, mode: 'insensitive' },
          },
        }),
        8000,
        'POST /api/admin/login'
      );
    } catch (dbErr) {
      console.error('🔥 Admin login DB query error:', dbErr?.message || dbErr, dbErr?.stack || '');
      if (dbErr.isTimeout || dbErr?.message?.includes('timeout')) {
        return sendError(res, 503, 'Database query timeout after 8s');
      }
      if (isPrismaFatalError(dbErr) || dbErr?.code === 'P2024' || dbErr?.message?.includes('P2024')) {
        return sendError(res, 503, 'Server temporarily unavailable, please try again');
      }
      throw dbErr;
    }

    if (!adminUser || !adminUser.passwordHash) {
      return sendError(res, 401, 'Invalid admin email or password');
    }

    const isValidPassword = await bcrypt.compare(password, adminUser.passwordHash);
    if (!isValidPassword) {
      return sendError(res, 401, 'Invalid admin email or password');
    }

    const userPayload = {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name || 'Admin User',
      role: 'admin',
    };

    const token = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    return sendSuccess(res, 200, { token, refreshToken, user: userPayload }, 'Admin authenticated successfully');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    if (error.isTimeout || error?.message?.includes('timeout')) {
      return sendError(res, 503, 'Database query timeout after 8s');
    }
    if (isPrismaFatalError(error) || error?.code === 'P2024' || error?.message?.includes('P2024')) {
      return sendError(res, 503, 'Server temporarily unavailable, please try again');
    }
    console.error('🔥 Admin login full error stack trace:', error);
    return sendError(res, 500, `Admin login error: ${error.message || 'Unexpected server error'}`);
  }
};

// --- Products Admin CRUD ---
export const createProduct = async (req, res) => {
  try {
    const validatedData = productSchema.parse(req.body);
    if (!validatedData.sizes || validatedData.sizes.length === 0) {
      validatedData.sizes = ['M', 'L', 'XL', 'XXL'];
    }
    if (validatedData.colorVariants && validatedData.colorVariants.length > 0) {
      const firstVariantImages = validatedData.colorVariants[0].images || [];
      validatedData.image = firstVariantImages[0] || validatedData.image;
      validatedData.secondaryImage = firstVariantImages[1] || firstVariantImages[0] || null;
    }
    const product = await prisma.product.create({ data: validatedData });
    return sendSuccess(res, 201, { product }, 'Product created successfully');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = productSchema.partial().parse(req.body);
    if (validatedData.colorVariants && validatedData.colorVariants.length > 0) {
      const firstVariantImages = validatedData.colorVariants[0].images || [];
      validatedData.image = firstVariantImages[0] || validatedData.image;
      validatedData.secondaryImage = firstVariantImages[1] || firstVariantImages[0] || null;
    }
    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
    });
    return sendSuccess(res, 200, { product }, 'Product updated successfully');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    return sendSuccess(res, 200, {}, 'Product deleted successfully');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

// --- Categories Admin CRUD ---
export const createCategory = async (req, res) => {
  try {
    const validatedData = categorySchema.parse(req.body);
    const category = await prisma.category.create({ data: validatedData });
    return sendSuccess(res, 201, { category }, 'Category created successfully');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = categorySchema.partial().parse(req.body);
    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
    });
    return sendSuccess(res, 200, { category }, 'Category updated successfully');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    return sendSuccess(res, 200, {}, 'Category deleted successfully');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

// --- Hero Slides Admin CRUD ---
export const addHeroSlide = async (req, res) => {
  try {
    const validatedData = heroSlideSchema.parse(req.body);
    const count = await prisma.heroSlide.count();
    const slide = await prisma.heroSlide.create({
      data: {
        ...validatedData,
        order: validatedData.order || count + 1,
      },
    });
    return sendSuccess(res, 201, { slide }, 'Hero slide added successfully');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const updateHeroSlides = async (req, res) => {
  try {
    const { slides } = req.body;
    if (!Array.isArray(slides)) {
      return sendError(res, 400, 'Slides must be an array');
    }
    const validatedSlides = z.array(heroSlideSchema.partial()).parse(slides);
    for (const s of validatedSlides) {
      if (s.id) {
        await prisma.heroSlide.update({
          where: { id: Number(s.id) },
          data: {
            subtitle: s.subtitle,
            title: s.title,
            description: s.description,
            cta: s.cta,
            categorySlug: s.categorySlug,
            image: s.image,
            order: s.order || 0,
          },
        });
      }
    }
    const updated = await prisma.heroSlide.findMany({ orderBy: { order: 'asc' } });
    return sendSuccess(res, 200, { slides: updated }, 'Hero slides updated successfully');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const deleteHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.heroSlide.delete({ where: { id: Number(id) } });
    return sendSuccess(res, 200, {}, 'Hero slide deleted successfully');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

// --- Promo Messages Admin CRUD ---
export const addPromoMessage = async (req, res) => {
  try {
    const validatedData = promoMessageSchema.parse(req.body);
    const count = await prisma.promoMessage.count();
    const promo = await prisma.promoMessage.create({
      data: {
        message: validatedData.message,
        order: validatedData.order || count + 1,
      },
    });
    return sendSuccess(res, 201, { promo }, 'Promo message added');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const updatePromoMessages = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return sendError(res, 400, 'Messages must be an array');
    }
    const promoArraySchema = z.array(z.union([z.string().min(1, 'Message text is required'), promoMessageSchema]));
    const validatedMessages = promoArraySchema.parse(messages);

    await prisma.promoMessage.deleteMany({});
    for (let i = 0; i < validatedMessages.length; i++) {
      const msg = typeof validatedMessages[i] === 'string' ? validatedMessages[i] : validatedMessages[i].message;
      await prisma.promoMessage.create({
        data: {
          message: msg,
          order: i + 1,
        },
      });
    }
    const updated = await prisma.promoMessage.findMany({ orderBy: { order: 'asc' } });
    return sendSuccess(res, 200, { messages: updated }, 'Promo messages updated');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const deletePromoMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.promoMessage.delete({ where: { id: Number(id) } });
    return sendSuccess(res, 200, {}, 'Promo message deleted');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

// --- Orders Admin Operations ---
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, 200, { orders }, 'Orders fetched successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, carrier } = req.body;

    const existingOrder = await prisma.order.findUnique({ where: { id } });
    if (!existingOrder) {
      return sendError(res, 404, 'Order not found');
    }

    const currentHistory = Array.isArray(existingOrder.statusHistory) ? existingOrder.statusHistory : [];
    const newStatus = status || existingOrder.status;

    const updatedHistory = [
      ...currentHistory,
      { status: newStatus, timestamp: new Date().toISOString() }
    ];

    const updateData = {
      status: newStatus,
      statusHistory: updatedHistory,
    };
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (carrier !== undefined) updateData.carrier = carrier;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    });
    return sendSuccess(res, 200, { order }, 'Order status updated');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

export const cancelAdminOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, cancellationReason } = req.body;

    const finalReason = (reason || cancellationReason || 'Cancelled by admin').toString().trim();

    const order = await prisma.order.findUnique({ where: { id } });
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

    return sendSuccess(res, 200, { order: updatedOrder }, 'Order cancelled successfully by admin');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// --- Discount Codes Admin CRUD ---
export const getAllDiscountCodes = async (req, res) => {
  try {
    const discounts = await prisma.discountCode.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, 200, { discounts }, 'Discount codes fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const addDiscountCode = async (req, res) => {
  try {
    const validatedData = discountCodeSchema.parse(req.body);
    const discount = await prisma.discountCode.create({ data: validatedData });
    return sendSuccess(res, 201, { discount }, 'Discount code created');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    if (error.code === 'P2002') {
      return sendError(res, 400, `Discount code '${req.body?.code}' already exists.`);
    }
    return sendError(res, 400, error.message);
  }
};

export const updateDiscountCode = async (req, res) => {
  try {
    const { code } = req.params;
    const validatedData = discountCodeSchema.partial().parse(req.body);
    const discount = await prisma.discountCode.update({
      where: { code },
      data: validatedData,
    });
    return sendSuccess(res, 200, { discount }, 'Discount code updated');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const deleteDiscountCode = async (req, res) => {
  try {
    const { code } = req.params;
    await prisma.discountCode.delete({ where: { code } });
    return sendSuccess(res, 200, {}, 'Discount code deleted');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

// --- Store Settings Admin Update ---
export const updateStoreSettings = async (req, res) => {
  try {
    const validatedData = storeSettingsSchema.partial().parse(req.body);
    const defaultSettings = {
      phone: "+919116655814",
      displayPhone: "+91 91166 55814",
      email: "surangi.naar@gmail.com",
      instagram: "https://www.instagram.com/surangi.naar",
      instagramHandle: "@surangi.naar",
      facebook: "https://www.facebook.com/profile.php?id=1274421192401737&hr=1&wtsid=rdr_0GcwbFGifB7kgtTxr",
      whatsapp: "https://wa.me/919116655814",
      address: "13-16, Paras Apartment, Chopra Enclave, Mangyawas, Mansarovar, Jaipur, Rajasthan, India",
      googleMaps: "https://maps.app.goo.gl/9kU8jVfN7ZBhj5fG9",
      hours: "Mon - Sat: 10:30 AM - 7:30 PM IST",
      shippingFee: 250,
      freeShippingThreshold: 5000,
    };
    const settings = await prisma.storeSettings.upsert({
      where: { id: 1 },
      update: validatedData,
      create: { id: 1, ...defaultSettings, ...validatedData },
    });
    return sendSuccess(res, 200, { settings }, 'Store settings updated');
  } catch (error) {
    if (error.name === 'ZodError') {
      const firstMsg = error.errors?.[0]?.message || 'Validation Error';
      return sendError(res, 400, firstMsg, error.errors);
    }
    return sendError(res, 400, error.message);
  }
};

export const verifyAdmin = async (req, res) => {
  return sendSuccess(res, 200, { valid: true, user: req.user }, 'Admin token verified');
};

// --- Registered Customers Admin Read ---
export const getAllCustomers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'customer' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        provider: true,
        createdAt: true,
        addresses: true,
        orders: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedCustomers = users.map(user => {
      const totalOrders = user.orders.length;
      const totalSpent = user.orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
      const primaryAddress = user.addresses.find(a => a.isDefault) || user.addresses[0] || null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || primaryAddress?.phone || null,
        avatar: user.avatar,
        provider: user.provider || 'email',
        createdAt: user.createdAt,
        totalOrders,
        totalSpent,
        primaryAddress: primaryAddress ? `${primaryAddress.street}, ${primaryAddress.city}, ${primaryAddress.state} - ${primaryAddress.pincode}` : null,
      };
    });

    return sendSuccess(res, 200, { customers: formattedCustomers }, 'Customers fetched successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

