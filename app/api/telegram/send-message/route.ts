import { NextRequest, NextResponse } from 'next/server';
import TelegramService from '@/lib/telegram';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    const telegramService = new TelegramService();
    const result = await telegramService.sendMessage(message);

    if (result.ok) {
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully to Telegram'
      });
    } else {
      return NextResponse.json(
        {
          error: 'Failed to send message to Telegram',
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