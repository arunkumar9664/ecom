import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().optional(),
  pin: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  categorySlug: z.string().min(1, 'Category slug is required'),
  price: z.number().positive('Price must be positive'),
  originalPrice: z.number().nullable().optional(),
  colorVariants: z.array(
    z.object({
      name: z.string().min(1, 'Color name is required'),
      hex: z.string().min(1, 'Color hex is required'),
      images: z.array(z.string().min(1, 'Image URL cannot be empty')).min(1, 'At least 1 image is required per variant').max(6, 'Maximum 6 images allowed per variant'),
    })
  ).min(1, 'At least one color variant is required'),
  sizes: z.array(z.string()).optional(),
  image: z.string().optional(),
  secondaryImage: z.string().nullable().optional(),
  badge: z.string().nullable().optional(),
  rating: z.number().optional(),
  isSoldOut: z.boolean().optional(),
  stockQuantity: z.number().optional(),
  description: z.string().nullable().optional(),
  fabric: z.string().nullable().optional(),
  care: z.string().nullable().optional(),
  craftsmanship: z.string().nullable().optional(),
  shipping: z.string().nullable().optional(),
});

export const categorySchema = z.object({
  id: z.string().min(1, 'ID is required'),
  slug: z.string().min(1, 'Slug is required'),
  name: z.string().min(1, 'Name is required'),
  count: z.string().nullable().optional(),
  image: z.string().min(1, 'Image is required'),
  tagline: z.string().nullable().optional(),
});

export const heroSlideSchema = z.object({
  subtitle: z.string(),
  title: z.string(),
  description: z.string(),
  cta: z.string(),
  categorySlug: z.string(),
  image: z.string(),
  order: z.number().optional(),
});

export const promoMessageSchema = z.object({
  message: z.string().min(1, 'Message text is required'),
  order: z.number().optional(),
});

export const discountCodeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  discountPercent: z.number().min(1).max(100),
  minSpend: z.number().min(0).optional(),
  description: z.string().min(1),
  isActive: z.boolean().optional(),
});

export const storeSettingsSchema = z.object({
  phone: z.string(),
  displayPhone: z.string().nullable().optional(),
  email: z.string().email(),
  instagram: z.string().nullable().optional(),
  instagramHandle: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  address: z.string(),
  googleMaps: z.string().nullable().optional(),
  hours: z.string(),
  shippingFee: z.number().int('Shipping fee must be an integer').nonnegative('Shipping fee cannot be negative').optional(),
  freeShippingThreshold: z.number().int('Free shipping threshold must be an integer').nonnegative('Free shipping threshold cannot be negative').optional(),
});
