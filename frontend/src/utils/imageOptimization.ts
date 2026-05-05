/**
 * Image Loading Utilities for Performance
 * Handles lazy loading, progressive loading, and image optimization
 */

// List of image domains that are trusted for lazy loading
const TRUSTED_DOMAINS = [
  'images.unsplash.com',
  'res.cloudinary.com',
  'cdn.example.com',
];

/**
 * Normalize image URL with optimization parameters
 * @param url - Original image URL
 * @param options - Image loading options
 */
export function optimizeImageUrl(
  url: string,
  options: {
    width?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  } = {}
) {
  if (!url) return '';

  // For Cloudinary URLs
  if (url.includes('cloudinary.com')) {
    const params = [];
    if (options.width) params.push(`w_${options.width}`);
    if (options.quality) params.push(`q_${options.quality}`);
    if (options.format) params.push(`f_${options.format}`);

    if (params.length > 0) {
      const [baseUrl, filename] = url.split('/upload/');
      return `${baseUrl}/upload/${params.join(',')}/${filename}`;
    }
  }

  return url;
}

/**
 * Get a lower resolution version of an image for placeholder
 */
export function getPlaceholderImageUrl(imageUrl: string): string {
  if (!imageUrl) return '';

  // For Cloudinary, generate a blurred placeholder
  if (imageUrl.includes('cloudinary.com')) {
    const [baseUrl, filename] = imageUrl.split('/upload/');
    return `${baseUrl}/upload/w_100,q_10,e_blur:300/c_fill/${filename}`;
  }

  return imageUrl;
}

/**
 * Create an img tag with lazy loading and optimization
 */
export function createOptimizedImage(
  src: string,
  alt: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
  } = {}
) {
  const optimized = optimizeImageUrl(src, options);
  return {
    src: optimized,
    alt,
    loading: 'lazy' as const,
    decoding: 'async' as const,
  };
}

/**
 * Preload an image for faster loading
 */
export function preloadImage(url: string): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Progressive image loading hook
 * Loads a low-res version first, then the high-res version
 */
export function getProgressiveImageSrc(imageUrl: string) {
  return {
    placeholder: getPlaceholderImageUrl(imageUrl),
    src: optimizeImageUrl(imageUrl, { quality: 85 }),
    srcSet: imageUrl,
  };
}
