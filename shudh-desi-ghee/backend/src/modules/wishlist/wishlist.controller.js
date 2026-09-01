import prisma from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId },
    });

    const products = await Promise.all(
      wishlistItems.map(async (item) => {
        return prisma.product.findUnique({ where: { id: item.productId } });
      })
    );

    return sendSuccess(res, 200, { wishlist: products.filter(Boolean) }, 'Wishlist fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return sendError(res, 400, 'productId is required');
    }

    const existing = await prisma.wishlistItem.findFirst({
      where: { userId, productId },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return sendSuccess(res, 200, { added: false }, 'Removed from wishlist');
    } else {
      await prisma.wishlistItem.create({
        data: { userId, productId },
      });
      return sendSuccess(res, 200, { added: true }, 'Added to wishlist');
    }
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const deleteWishlistItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await prisma.wishlistItem.deleteMany({
      where: { userId, productId },
    });

    return sendSuccess(res, 200, {}, 'Removed from wishlist');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
