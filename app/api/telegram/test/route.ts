import { NextResponse } from 'next/server';
import TelegramService from '@/lib/telegram';

export async function GET() {
  try {
    const telegramService = new TelegramService();
    const result = await telegramService.testConnection();

    if (result.ok) {
      return NextResponse.json({
        success: true,
        message: 'Telegram bot connection successful',
        botInfo: result.result
      });
    } else {
      return NextResponse.json(
        {
          error: 'Failed to connect to Telegram bot',
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