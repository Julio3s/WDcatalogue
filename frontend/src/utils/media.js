/**
 * Helper functions for product and category images.
 */

export function normalizePublicUrl(url) {
  if (!url) return '';

  const value = String(url).trim();
  if (!value) return '';

  if (value.startsWith('http://')) {
    return `https://${value.slice('http://'.length)}`;
  }

  return value;
}

/**
 * Get the best available image URL for a product.
 */
export function getProductImage(product) {
  if (!product) return '';

  // Prioritize image_url from serializer
  if (product.image_url) return normalizePublicUrl(product.image_url);

  // Fall back to image field
  if (product.image) return normalizePublicUrl(product.image);

  // If product has images array, get the first image
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const firstImage = product.images[0];
    if (firstImage.image_url) return normalizePublicUrl(firstImage.image_url);
    if (firstImage.image) return normalizePublicUrl(firstImage.image);
  }

  return '';
}

/**
 * Get the best available image URL for a category.
 */
export function getCategoryImage(category) {
  if (!category) return '';

  if (category.image_url) return normalizePublicUrl(category.image_url);
  if (category.image) return normalizePublicUrl(category.image);

  return '';
}

/**
 * Optimize a Cloudinary image URL for a given width.
 * (Kept as a simple passthrough; Cloudinary transformations can be added later.)
 */
export function optimizeImageUrl(url, width = 800) {
  if (!url) return null;
  return normalizePublicUrl(url);
}
