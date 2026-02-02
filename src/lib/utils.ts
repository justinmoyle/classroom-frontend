import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Optimizes a Cloudinary URL to include cropping and standard quality/format transformations.
 * If the URL is not a Cloudinary URL, it returns it as is.
 * 
 * @param url The original Cloudinary URL
 * @param width Width of the output image
 * @param height Height of the output image
 * @returns The transformed URL
 */
export function getOptimizedCloudinaryUrl(url?: string, width = 400, height = 400) {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  // Check if it already has transformations
  if (url.includes('/image/upload/c_')) return url;

  const transformation = `c_fill,g_custom,w_${width},h_${height},f_auto,q_auto`;
  
  // Inject transformation after /upload/
  return url.replace('/image/upload/', `/image/upload/${transformation}/`);
}
