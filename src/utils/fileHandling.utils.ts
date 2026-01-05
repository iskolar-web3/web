import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';
import { compressFile } from './fileCompression.utils';

/**
 * File handling result interface
 */
export interface FileHandlingResult {
  file: File;
  preview: string | null;
  error: string | null;
}

/**
 * File validation and handling constants
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
export const PDFJS_VERSION = '3.11.174';

/**
 * PDF.js library loading state
 */
let pdfjsLoadedRef = false;

/**
 * Loads PDF.js library if not already loaded
 * @returns Promise that resolves when PDF.js is loaded
 */
export async function loadPDFJS(): Promise<void> {
  if (pdfjsLoadedRef) {
    return;
  }

  if ((window as any).pdfjsLib) {
    pdfjsLoadedRef = true;
    return;
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;
      pdfjsLoadedRef = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js'));
    document.head.appendChild(script);
  });
}

/**
 * Validates file type and size
 * @param file - File to validate
 * @returns Error message string if validation fails, null if valid
 */
export function validateFile(file: File): string | null {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Invalid file type. Please upload PNG, JPG, or PDF files only.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
  }
  return null;
}

/**
 * Generates a preview image from a PDF file
 * @param file - PDF file to generate preview from
 * @returns Promise that resolves to a data URL string of the preview
 */
export async function generatePDFPreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = async function() {
      try {
        const typedArray = new Uint8Array(this.result as ArrayBuffer);
        const pdfjsLib = (window as any).pdfjsLib;
        
        if (!pdfjsLib) {
          reject(new Error('PDF.js library not loaded'));
          return;
        }
        
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        const page = await pdf.getPage(1);
        
        const scale = 2;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        resolve(canvas.toDataURL());
      } catch (error) {
        reject(error);
      }
    };
    
    fileReader.onerror = () => reject(new Error('Failed to read file'));
    fileReader.readAsArrayBuffer(file);
  });
}

/**
 * Generates a preview for an image file
 * @param file - Image file to generate preview from
 * @returns Promise that resolves to a data URL string of the preview
 */
export function generateImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error('Failed to read image file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Handles file selection, validation, compression, and preview generation
 * @param selectedFile - The file selected by the user
 * @param options - Optional configuration
 * @returns Promise that resolves to FileHandlingResult
 */
export async function handleFileSelection(
  selectedFile: File,
  options?: {
    compress?: boolean;
    waitForPDFJS?: boolean;
  }
): Promise<FileHandlingResult> {
  const { compress = true, waitForPDFJS = true } = options || {};

  const validationError = validateFile(selectedFile);
  if (validationError) {
    return {
      file: selectedFile,
      preview: null,
      error: validationError,
    };
  }

  try {
    let processedFile = selectedFile;
    if (compress) {
      try {
        processedFile = await compressFile(selectedFile);
      } catch (error) {
        const handled = handleError(error, 'File compression failed');
        logger.warn('File compression failed, using original file:', handled.raw);
      }
    }

    let preview: string | null = null;

    // Generate preview based on file type
    if (processedFile.type.startsWith('image/')) {
      preview = await generateImagePreview(processedFile);
    } else if (processedFile.type === 'application/pdf') {
      if (waitForPDFJS) {
        try {
          await loadPDFJS();

          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          const handled = handleError(error, 'Failed to load PDF.js library');
          logger.error('PDF.js loading error:', handled.raw);
          return {
            file: processedFile,
            preview: null,
            error: handled.message,
          };
        }
      }
      
      try {
        preview = await generatePDFPreview(processedFile);
      } catch (error) {
        const handled = handleError(error, 'Failed to generate PDF preview');
        logger.error('Failed to generate PDF preview:', handled.raw);
        return {
          file: processedFile,
          preview: null,
          error: handled.message,
        };
      }
    }

    return {
      file: processedFile,
      preview,
      error: null,
    };
  } catch (error) {
    const handled = handleError(error, 'Failed to process file');
    logger.error('File handling error:', handled.raw);
    return {
      file: selectedFile,
      preview: null,
      error: handled.message,
    };
  }
}

/**
 * Formats file size for display
 * @param bytes - File size in bytes
 * @returns Formatted file size string (e.g., "2.50 MB")
 */
export function formatFileSize(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}