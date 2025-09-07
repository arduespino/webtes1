import { NextRequest, NextResponse } from 'next/server';
import TelegramService from '@/lib/telegram';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const photo = formData.get('photo') as File;
    const caption = formData.get('caption') as string | null;

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo file is required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(photo.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 20MB for Telegram)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (photo.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 20MB.' },
        { status: 400 }
      );
    }

    const telegramService = new TelegramService();
    const result = await telegramService.sendPhoto({
      file: photo,
      caption: caption || undefined
    });

    if (result.ok) {
      return NextResponse.json({
        success: true,
        message: 'Photo sent successfully to Telegram',
        data: result.result
      });
    } else {
      return NextResponse.json(
        {
          error: 'Failed to send photo to Telegram',
          details: result.description
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}