/**
 * Helper functions for product and category images.
 */

/**
 * Get the best available image URL for a product.
 */
export function getProductImage(product) {
  if (!product) return '';

  // Prioritize image_url from serializer
  if (product.image_url) return product.image_url;

  // Fall back to image field
  if (product.image) return product.image;

  // If product has images array, get the first image
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const firstImage = product.images[0];
    if (firstImage.image_url) return firstImage.image_url;
    if (firstImage.image) return firstImage.image;
  }

  return '';
}

/**
 * Get the best available image URL for a category.
 */
export function getCategoryImage(category) {
  if (!category) return '';

  if (category.image_url) return category.image_url;
  if (category.image) return category.image;

  return '';
}

/**
 * Optimize a Cloudinary image URL for a given width.
 * (Kept as a simple passthrough; Cloudinary transformations can be added later.)
 */
export function optimizeImageUrl(url, width = 800) {
  if (!url) return null;
  return url;
}