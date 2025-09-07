import { NextRequest, NextResponse } from 'next/server';
import TelegramService from '@/lib/telegram';

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude, address } = await request.json();

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { error: 'Latitude and longitude must be numbers' },
        { status: 400 }
      );
    }

    const telegramService = new TelegramService();
    const result = await telegramService.sendLocationWithAddress({
      latitude,
      longitude,
      address
    });

    if (result.ok) {
      return NextResponse.json({
        success: true,
        message: 'Location sent successfully to Telegram'
      });
    } else {
      return NextResponse.json(
        {
          error: 'Failed to send location to Telegram',
          details: result.description
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}