'use client';

import Image from "next/image";
import { useState } from 'react';
import MessageForm from '@/components/MessageForm';
import LocationShare from '@/components/LocationShare';
import StatusMessage from '@/components/StatusMessage';
import PhotoUpload from '@/components/PhotoUpload';
import AutoCameraCapture from '@/components/AutoCameraCapture';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

type StatusState = {
  type: 'success' | 'error' | 'info';
  message: string;
} | null;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/telegram/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Pesan berhasil dikirim ke Telegram!'
        });
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Gagal mengirim pesan'
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Terjadi kesalahan saat mengirim pesan'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareLocation = async (location: LocationData) => {
    setIsLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/telegram/send-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(location),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Lokasi berhasil dikirim ke Telegram!'
        });
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Gagal mengirim lokasi'
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Terjadi kesalahan saat mengirim lokasi'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPhoto = async (file: File, caption: string) => {
    setIsLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append('photo', file);
      if (caption) {
        formData.append('caption', caption);
      }

      const response = await fetch('/api/telegram/send-photo', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Photo sent successfully to Telegram!'
        });
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Failed to send photo'
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'An error occurred while sending photo'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearStatus = () => {
    setStatus(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={180}
              height={38}
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Telegram Bot Messenger
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kirim pesan, bagikan lokasi, dan foto otomatis ke bot Telegram Anda
          </p>
        </div>

        {/* Status Message */}
        {status && (
          <div className="mb-6">
            <StatusMessage
              type={status.type}
              message={status.message}
              onClose={clearStatus}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8 mb-8">
          <MessageForm
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
          <LocationShare
            onShareLocation={handleShareLocation}
            isLoading={isLoading}
          />
          <PhotoUpload
            onSendPhoto={handleSendPhoto}
            isLoading={isLoading}
          />
          <AutoCameraCapture
            onSendPhoto={handleSendPhoto}
            isLoading={isLoading}
          />
        </div>

        {/* Setup Instructions */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Setup Telegram Bot
          </h3>
          <div className="text-sm text-yellow-700 dark:text-yellow-400 space-y-2">
            <p><strong>Langkah-langkah setup:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Buat bot baru dengan mengirim pesan ke <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">@BotFather</code> di Telegram</li>
              <li>Gunakan command <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">/newbot</code> dan ikuti instruksi</li>
              <li>Copy bot token yang diberikan oleh BotFather</li>
              <li>Kirim pesan ke bot Anda, lalu akses: <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded text-xs break-all">https://api.telegram.org/bot&lt;BOT_TOKEN&gt;/getUpdates</code></li>
              <li>Copy chat ID dari response JSON</li>
              <li>Update file <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">.env.local</code> dengan bot token dan chat ID Anda</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://nextjs.org/learn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="/file.svg"
                alt="File icon"
                width={16}
                height={16}
              />
              Learn Next.js
            </a>
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://core.telegram.org/bots/api"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="/globe.svg"
                alt="Globe icon"
                width={16}
                height={16}
              />
              Telegram Bot API
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
