/**
 * Transforms Cloudinary image URLs to include automatic format and quality optimization (f_auto,q_auto)
 * as well as optional display width parameters (e.g. w_800) to prevent serving unoptimized high-res images.
 */
export const optimizeCloudinaryUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string') return url;

  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    const quality = options.quality || 'auto';
    const format = options.format || 'auto';
    const widthParam = options.width ? `,w_${options.width}` : '';

    const newTransform = `f_${format},q_${quality}${widthParam}`;

    // If already has transformation parameters
    if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto') || url.includes('/upload/c_') || url.includes('/upload/w_')) {
      if (options.width && !url.includes(`w_${options.width}`)) {
        return url.replace(/\/upload\/([^/]+)\//, (match, existingTransforms) => {
          if (existingTransforms.includes('w_')) return match;
          return `/upload/${existingTransforms},w_${options.width}/`;
        });
      }
      return url;
    }

    return url.replace('/upload/', `/upload/${newTransform}/`);
  }

  return url;
};

/**
 * Helper function to safely format and optimize image URLs across the application.
 * Fixes missing leading slashes, bare filenames, backend upload URLs, and applies Cloudinary auto-optimizations.
 */
export const getImageUrl = (path, options = {}) => {
  if (!path) return '/images/products/real_product_1.jpg';

  // Apply Cloudinary auto-optimization parameters if URL is from Cloudinary
  if (typeof path === 'string' && path.includes('res.cloudinary.com')) {
    return optimizeCloudinaryUrl(path, options);
  }

  // Return full URLs or data URLs directly
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // If path is absolute starting with slash
  if (path.startsWith('/')) {
    return path;
  }

  // If path starts with images/
  if (path.startsWith('images/')) {
    return `/${path}`;
  }

  // If path starts with uploads/ (backend static uploads)
  if (path.startsWith('uploads/')) {
    const backendHost = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
      : 'http://localhost:5000';
    return `${backendHost}/${path}`;
  }

  // Bare filename like "real_product_2.jpg"
  return `/images/products/${path}`;
};
