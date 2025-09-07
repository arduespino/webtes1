'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ImageCompressor } from '@/lib/imageCompression';

interface AutoCameraCaptureProps {
  onSendPhoto: (file: File, caption: string) => Promise<void>;
  isLoading: boolean;
}

export default function AutoCameraCapture({ onSendPhoto, isLoading }: AutoCameraCaptureProps) {
  const [isActive, setIsActive] = useState(false);
  const [_hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [lastCapture, setLastCapture] = useState<string | null>(null);
  const [captureCount, setCaptureCount] = useState(0);
  const [interval, setInterval] = useState(5); // seconds
  const [error, setError] = useState<string | null>(null);
  const [lastCaptureTime, setLastCaptureTime] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Request camera permission and start stream
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera if available
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      streamRef.current = stream;
      setHasPermission(true);
      return true;
    } catch (error: unknown) {
      console.error('Camera access error:', error);
      setHasPermission(false);
      
      if (error.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permission.');
      } else if (error.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else if (error.name === 'NotSupportedError') {
        setError('Camera not supported on this browser.');
      } else {
        setError('Failed to access camera: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
      return false;
    }
  }, []);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHasPermission(null);
  }, []);

  // Capture photo from video stream
  const capturePhoto = useCallback(async (): Promise<File | null> => {
    if (!videoRef.current || !canvasRef.current) {
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    // Set canvas size to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(null);
          return;
        }

        // Create file from blob
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const file = new File([blob], `auto-capture-${timestamp}.jpg`, {
          type: 'image/jpeg'
        });

        try {
          // Compress the image
          const compressedFile = await ImageCompressor.autoCompress(file);
          resolve(compressedFile);
        } catch (error) {
          console.error('Compression failed:', error);
          resolve(file); // Fallback to original
        }
      }, 'image/jpeg', 0.8);
    });
  }, []);

  // Auto capture and send
  const autoCapture = useCallback(async () => {
    try {
      const file = await capturePhoto();
      if (!file) {
        setError('Failed to capture photo');
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setLastCapture(url);
      
      // Auto-generate caption with timestamp and count
      const now = new Date();
      const caption = `🤖 Auto capture #${captureCount + 1}\n📅 ${now.toLocaleDateString()}\n🕐 ${now.toLocaleTimeString()}`;
      
      // Send to Telegram automatically
      await onSendPhoto(file, caption);
      
      setCaptureCount(prev => prev + 1);
      setLastCaptureTime(now.toLocaleTimeString());
      
      // Clean up old preview URL
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 10000); // Clean up after 10 seconds
      
    } catch (error: unknown) {
      console.error('Auto capture error:', error);
      setError('Failed to capture and send photo: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [capturePhoto, onSendPhoto, captureCount]);

  // Start auto capture service
  const startAutoCapture = useCallback(async () => {
    if (isActive) return;

    const cameraStarted = await startCamera();
    if (!cameraStarted) return;

    setIsActive(true);
    setCaptureCount(0);
    setError(null);

    // Start interval for auto capture
    intervalRef.current = setInterval(() => {
      autoCapture();
    }, interval * 1000);

    // Take first photo immediately
    setTimeout(() => {
      autoCapture();
    }, 1000); // Wait 1 second for camera to initialize
  }, [isActive, startCamera, autoCapture, interval]);

  // Stop auto capture service
  const stopAutoCapture = useCallback(() => {
    setIsActive(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    stopCamera();
    setError(null);
  }, [stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoCapture();
      if (lastCapture) {
        URL.revokeObjectURL(lastCapture);
      }
    };
  }, [stopAutoCapture, lastCapture]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        🤖 Auto Camera Capture
      </h2>

      <div className="space-y-4">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm font-medium text-red-800 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* Settings */}
        {!isActive && (
          <div className="space-y-4">
            <div>
              <label htmlFor="interval" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Capture Interval (seconds)
              </label>
              <select
                id="interval"
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value={3}>Every 3 seconds</option>
                <option value={5}>Every 5 seconds</option>
                <option value={10}>Every 10 seconds</option>
                <option value={15}>Every 15 seconds</option>
                <option value={30}>Every 30 seconds</option>
                <option value={60}>Every 1 minute</option>
                <option value={120}>Every 2 minutes</option>
                <option value={300}>Every 5 minutes</option>
              </select>
            </div>

            <button
              onClick={startAutoCapture}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1M12 3v1m6.364.636l-.707.707M21 12h-1M18.364 18.364l-.707-.707M12 21v-1m-6.364-.636l.707-.707M3 12h1M5.636 5.636l.707.707" />
              </svg>
              Start Auto Capture
            </button>
          </div>
        )}

        {/* Active Status */}
        {isActive && (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-800 dark:text-green-300">
                  Auto capture active - Every {interval} seconds
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{captureCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Photos Sent</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {lastCaptureTime || 'Not started'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Last Capture</div>
              </div>
            </div>

            <button
              onClick={stopAutoCapture}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
              </svg>
              Stop Auto Capture
            </button>
          </div>
        )}

        {/* Last Capture Preview */}
        {lastCapture && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Capture:</h3>
            <Image
              src={lastCapture}
              alt="Last capture"
              width={400}
              height={128}
              className="w-full max-h-32 object-contain rounded-md border border-gray-200 dark:border-gray-600"
              unoptimized
            />
          </div>
        )}

        {/* Hidden Video and Canvas */}
        <div className="hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full"
          />
          <canvas ref={canvasRef} />
        </div>

        {/* Information */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-1">How it works:</p>
              <ul className="space-y-1 text-xs">
                <li>• Camera runs in background (hidden)</li>
                <li>• Photos captured automatically at set intervals</li>
                <li>• Each photo sent to Telegram immediately</li>
                <li>• Includes auto-generated timestamp captions</li>
                <li>• Images compressed for optimal sending</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}