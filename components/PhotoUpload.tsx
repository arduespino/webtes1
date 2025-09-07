'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ImageCompressor } from '@/lib/imageCompression';

interface PhotoUploadProps {
  onSendPhoto: (file: File, caption: string) => Promise<void>;
  isLoading: boolean;
}

export default function PhotoUpload({ onSendPhoto, isLoading }: PhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file type and size
  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 20 * 1024 * 1024; // 20MB

    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.';
    }

    if (file.size > maxSize) {
      return 'File size too large. Maximum size is 20MB.';
    }

    return null;
  };

  // Handle file selection with compression
  const handleFileSelect = useCallback(async (file: File) => {
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    setUploadError(null);
    setOriginalFile(file);
    setIsCompressing(true);

    try {
      // Compress image if needed
      const compressedFile = await ImageCompressor.autoCompress(file);
      setSelectedFile(compressedFile);
      
      // Create preview URL from original file for better quality preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } catch (error) {
      console.error('Compression failed:', error);
      // Fallback to original file if compression fails
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } finally {
      setIsCompressing(false);
    }
  }, []);

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Handle send photo
  const handleSendPhoto = async () => {
    if (selectedFile) {
      await onSendPhoto(selectedFile, caption);
      // Reset form after successful send
      handleReset();
    }
  };

  // Reset form
  const handleReset = () => {
    setSelectedFile(null);
    setOriginalFile(null);
    setPreviewUrl(null);
    setCaption('');
    setUploadError(null);
    setIsCompressing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Clean up preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        📷 Send Photo to Telegram
      </h2>

      <div className="space-y-4">
        {/* Upload Error */}
        {uploadError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm font-medium text-red-800 dark:text-red-300">{uploadError}</span>
            </div>
          </div>
        )}

        {/* Compression Status */}
        {isCompressing && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Optimizing image...</span>
            </div>
          </div>
        )}

        {!selectedFile ? (
          // Upload Area
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            <div className="flex flex-col items-center space-y-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Drop your photo here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  or click to browse files
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Choose Photo
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Supports: JPEG, PNG, GIF, WebP (max 20MB)
              </p>
            </div>
          </div>
        ) : (
          // Preview Area
          <div className="space-y-4">
            {/* Photo Preview */}
            <div className="relative">
              <Image
                src={previewUrl!}
                alt="Preview"
                width={400}
                height={300}
                className="w-full max-h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-600"
                unoptimized
              />
              <button
                onClick={handleReset}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* File Info */}
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              <div className="text-sm space-y-2">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{originalFile?.name || selectedFile.name}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      {originalFile && originalFile.size !== selectedFile.size ? (
                        <div className="space-y-1">
                          <p className="text-gray-500 dark:text-gray-400 line-through">
                            Original: {formatFileSize(originalFile.size)}
                          </p>
                          <p className="text-green-600 dark:text-green-400">
                            Optimized: {formatFileSize(selectedFile.size)} ({Math.round((1 - selectedFile.size / originalFile.size) * 100)}% smaller)
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                          {formatFileSize(selectedFile.size)} • {selectedFile.type}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-600 text-sm font-medium">Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Caption Input */}
            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Caption (optional)
              </label>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption to your photo..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                rows={3}
                maxLength={1024}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {caption.length}/1024 characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleSendPhoto}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Photo
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
}