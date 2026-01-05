import imageCompression from 'browser-image-compression';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';

/**
 * Compresses an image file using browser-image-compression
 * 
 * @param file - The image File object to compress
 * @returns A Promise that resolves to the compressed File object
 *          or the original file if compression fails
 */
export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: file.type,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    const handled = handleError(error, 'Image compression failed');
    logger.error('Image compression failed:', handled.raw);
    return file;
  }
};

/**
 * Compresses a PDF file if it exceeds a specified size limit
 * 
 * @param file - The PDF File object to compress
 * @returns A Promise that resolves to the original File object 
 *          if size is under 10MB, otherwise returns the file 
 */
export const compressPDF = async (file: File): Promise<File> => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (file.size <= maxSize) {
    return file;
  }

  return file;
};

/**
 * Compresses a file (image or PDF) based on its MIME type
 * 
 * @param file - The File object to compress
 * @returns A Promise that resolves to the compressed File object
 *          or the original file if no compression is applicable
 */
export const compressFile = async (file: File): Promise<File> => {
  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';

  if (isImage) {
    return await compressImage(file);
  } else if (isPDF) {
    return await compressPDF(file);
  }

  return file;
};
