/**
 * Utility to format image URLs for optimized delivery.
 * If the URL is a Cloudinary URL, appends transformation parameters (auto format, auto quality, width/height).
 * Otherwise, returns the original URL untouched.
 */
export interface CloudinaryOptions {
  width?: number;
  height?: number;
  crop?: 'scale' | 'fit' | 'fill' | 'thumb';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
}

export const getOptimizedImageUrl = (
  url: string | null | undefined,
  options: CloudinaryOptions = {}
): string => {
  if (!url) return '';

  // Only transform Cloudinary URLs
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }

  const {
    width,
    height,
    crop = 'scale',
    quality = 'auto',
    format = 'auto',
  } = options;

  const transformations: string[] = [`f_${format}`, `q_${quality}`];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (width || height) transformations.push(`c_${crop}`);

  const transformString = transformations.join(',');

  // Insert transformations right after /upload/
  return url.replace('/upload/', `/upload/${transformString}/`);
};
