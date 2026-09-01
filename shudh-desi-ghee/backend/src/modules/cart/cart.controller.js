import prisma from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
    });

    // Populate product details for each cart item
    const populatedItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        return {
          ...item,
          product,
        };
      })
    );

    return sendSuccess(res, 200, { cart: populatedItems }, 'Cart items fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, colorName, size, quantity = 1 } = req.body;

    if (!productId || !colorName || !size) {
      return sendError(res, 400, 'productId, colorName, and size are required');
    }

    const qty = Math.max(1, Number(quantity) || 1);

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
        colorName,
        size,
      },
    });

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + qty },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          colorName,
          size,
          quantity: qty,
        },
      });
    }

    return sendSuccess(res, 200, { cartItem }, 'Item added to cart');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    const existingItem = await prisma.cartItem.findFirst({
      where: { id, userId },
    });

    if (!existingItem) {
      return sendError(res, 404, 'Cart item not found or unauthorized');
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id } });
      return sendSuccess(res, 200, {}, 'Cart item removed');
    }

    const cartItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });

    return sendSuccess(res, 200, { cartItem }, 'Cart item updated');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existingItem = await prisma.cartItem.findFirst({
      where: { id, userId },
    });

    if (!existingItem) {
      return sendError(res, 404, 'Cart item not found or unauthorized');
    }

    await prisma.cartItem.delete({ where: { id } });
    return sendSuccess(res, 200, {}, 'Cart item deleted');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await prisma.cartItem.deleteMany({ where: { userId } });
    return sendSuccess(res, 200, {}, 'Cart cleared');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
