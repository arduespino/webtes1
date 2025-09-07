/**
 * Image compression utilities for optimizing photos before upload
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
  format?: 'jpeg' | 'png' | 'webp';
}

export class ImageCompressor {
  /**
   * Compress an image file
   */
  static async compressImage(
    file: File,
    options: CompressionOptions = {}
  ): Promise<File> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'jpeg'
    } = options;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const { width, height } = this.calculateDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight
        );

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, `.${format}`),
                {
                  type: `image/${format}`,
                  lastModified: Date.now(),
                }
              );
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          `image/${format}`,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Calculate optimal dimensions while maintaining aspect ratio
   */
  private static calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    const { width, height } = { width: originalWidth, height: originalHeight };

    // If image is smaller than max dimensions, return original
    if (width <= maxWidth && height <= maxHeight) {
      return { width, height };
    }

    // Calculate scaling factor
    const widthRatio = maxWidth / width;
    const heightRatio = maxHeight / height;
    const scalingFactor = Math.min(widthRatio, heightRatio);

    return {
      width: Math.round(width * scalingFactor),
      height: Math.round(height * scalingFactor),
    };
  }

  /**
   * Get image dimensions without loading the full image
   */
  static async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for dimension check'));
        URL.revokeObjectURL(img.src);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Check if image needs compression
   */
  static shouldCompress(
    file: File,
    maxSize: number = 5 * 1024 * 1024 // 5MB
  ): boolean {
    return file.size > maxSize;
  }

  /**
   * Auto-compress image based on file size and dimensions
   */
  static async autoCompress(file: File): Promise<File> {
    try {
      const shouldCompress = this.shouldCompress(file);
      
      if (!shouldCompress) {
        return file;
      }

      // Get image dimensions to determine compression level
      const dimensions = await this.getImageDimensions(file);
      const totalPixels = dimensions.width * dimensions.height;

      // Determine compression settings based on image size
      let compressionOptions: CompressionOptions;

      if (totalPixels > 8000000) { // 8MP+
        compressionOptions = {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.7,
          format: 'jpeg'
        };
      } else if (totalPixels > 4000000) { // 4MP+
        compressionOptions = {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.8,
          format: 'jpeg'
        };
      } else if (file.size > 2 * 1024 * 1024) { // 2MB+
        compressionOptions = {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.85,
          format: 'jpeg'
        };
      } else {
        // Small file, just ensure it's not too large dimensionally
        compressionOptions = {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.9,
          format: file.type.includes('png') ? 'png' : 'jpeg'
        };
      }

      return await this.compressImage(file, compressionOptions);
    } catch (error) {
      console.warn('Image compression failed, using original file:', error);
      return file;
    }
  }
}