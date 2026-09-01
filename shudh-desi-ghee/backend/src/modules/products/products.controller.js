import prisma, { withQueryTimeout } from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getProducts = async (req, res) => {
  try {
    const { categorySlug, minPrice, maxPrice, size, search, page = 1, limit = 50 } = req.query;

    const where = {};

    if (categorySlug && categorySlug !== 'all') {
      where.categorySlug = categorySlug;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (size) {
      where.sizes = {
        has: size,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { fabric: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [products, total] = await withQueryTimeout(
      () => Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where }),
      ]),
      8000,
      'GET /api/products'
    );

    const productIds = products.map(p => p.id);
    let reviewAggregates = [];
    if (productIds.length > 0) {
      reviewAggregates = await withQueryTimeout(
        () => prisma.review.groupBy({
          by: ['productId'],
          where: { productId: { in: productIds } },
          _avg: { rating: true },
          _count: { rating: true },
        }),
        8000,
        'GET /api/products reviews'
      );
    }

    const metricsMap = {};
    reviewAggregates.forEach(agg => {
      const count = agg._count.rating || 0;
      const avg = agg._avg.rating || 0;
      metricsMap[agg.productId] = {
        reviewCount: count,
        averageRating: count > 0 ? Number(avg.toFixed(1)) : 0,
      };
    });

    const productsWithMetrics = products.map(p => ({
      ...p,
      reviewCount: metricsMap[p.id]?.reviewCount || 0,
      averageRating: metricsMap[p.id]?.averageRating || 0,
    }));

    return sendSuccess(res, 200, {
      products: productsWithMetrics,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    }, 'Products fetched successfully');
  } catch (error) {
    console.error('🔥 GET /api/products error:', error?.message || error, error?.stack || '');
    if (error.isTimeout || error.message?.includes('timeout')) {
      return sendError(res, 503, 'Database query timeout after 8s');
    }
    return sendError(res, 500, error.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    const aggregate = await prisma.review.aggregate({
      where: { productId: id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const reviewCount = aggregate._count.rating || 0;
    const rawAvg = aggregate._avg.rating || 0;
    const averageRating = reviewCount > 0 ? Number(rawAvg.toFixed(1)) : 0;

    return sendSuccess(res, 200, {
      product: {
        ...product,
        averageRating,
        reviewCount,
      },
    }, 'Product details fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const submitProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return sendError(res, 400, 'Rating must be an integer between 1 and 5');
    }

    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    // Check if user has at least one Delivered order containing this product
    const userDeliveredOrders = await prisma.order.findMany({
      where: {
        userId,
        status: 'Delivered',
      },
    });

    const hasPurchased = userDeliveredOrders.some(order => {
      if (!Array.isArray(order.items)) return false;
      return order.items.some(item => item.id === id || item.productId === id);
    });

    if (!hasPurchased) {
      return sendError(res, 403, "You can only review products you've received");
    }

    // Upsert review (one review per user per product)
    const review = await prisma.review.upsert({
      where: {
        productId_userId: {
          productId: id,
          userId,
        },
      },
      update: {
        rating: parsedRating,
        comment: comment ? String(comment).trim() : null,
      },
      create: {
        productId: id,
        userId,
        rating: parsedRating,
        comment: comment ? String(comment).trim() : null,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    return sendSuccess(res, 200, { review }, 'Review submitted successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId: id },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.review.count({ where: { productId: id } }),
    ]);

    // Check if current logged-in user can review or has an existing review
    let userReview = null;
    let canReview = false;

    if (req.user) {
      userReview = await prisma.review.findUnique({
        where: {
          productId_userId: {
            productId: id,
            userId: req.user.id,
          },
        },
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
      });

      const userDeliveredOrders = await prisma.order.findMany({
        where: {
          userId: req.user.id,
          status: 'Delivered',
        },
      });

      canReview = userDeliveredOrders.some(order => {
        if (!Array.isArray(order.items)) return false;
        return order.items.some(item => item.id === id || item.productId === id);
      });
    }

    return sendSuccess(res, 200, {
      reviews,
      userReview,
      canReview,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    }, 'Reviews fetched successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
