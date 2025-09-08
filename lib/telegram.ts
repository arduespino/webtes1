import axios, { AxiosError } from 'axios';

export interface TelegramPhoto {
  file: File | Blob;
  caption?: string;
}

export interface TelegramMessage {
  text: string;
}

export interface TelegramLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface TelegramResponse {
  ok: boolean;
  result?: unknown;
  error_code?: number;
  description?: string;
}

// Helper function to extract error information safely
function getErrorInfo(error: unknown): { error_code: number; description: string } {
  if (error instanceof Error) {
    // Check if it's an Axios error
    if ('response' in error && error.response && typeof error.response === 'object') {
      const axiosError = error as AxiosError<{ error_code?: number; description?: string }>;
      return {
        error_code: axiosError.response?.data?.error_code || axiosError.response?.status || 500,
        description: axiosError.response?.data?.description || error.message
      };
    }
    return {
      error_code: 500,
      description: error.message
    };
  }
  return {
    error_code: 500,
    description: 'Unknown error'
  };
}

class TelegramService {
  private botToken: string;
  private chatId: string;
  private baseUrl: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
    
    if (!this.botToken || !this.chatId) {
      throw new Error('Telegram bot token and chat ID must be configured in environment variables');
    }
  }

  /**
   * Send a text message to the configured Telegram chat
   */
  async sendMessage(text: string): Promise<TelegramResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/sendMessage`, {
        chat_id: this.chatId,
        text: text,
        parse_mode: 'HTML'
      });

      return {
        ok: true,
        result: response.data.result
      };
    } catch (error: unknown) {
      console.error('Error sending Telegram message:', error);
      const errorInfo = getErrorInfo(error);
      return {
        ok: false,
        error_code: errorInfo.error_code,
        description: errorInfo.description
      };
    }
  }

  /**
   * Send a photo to the configured Telegram chat
   */
  async sendPhoto(photo: TelegramPhoto): Promise<TelegramResponse> {
    try {
      const formData = new FormData();
      formData.append('chat_id', this.chatId);
      formData.append('photo', photo.file);
      
      if (photo.caption) {
        formData.append('caption', photo.caption);
        formData.append('parse_mode', 'HTML');
      }

      const response = await axios.post(`${this.baseUrl}/sendPhoto`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        ok: true,
        result: response.data.result
      };
    } catch (error: unknown) {
      console.error('Error sending Telegram photo:', error);
      const errorInfo = getErrorInfo(error);
      return {
        ok: false,
        error_code: errorInfo.error_code,
        description: errorInfo.description
      };
    }
  }

  /**
   * Send location data to the configured Telegram chat
   */
  async sendLocation(latitude: number, longitude: number): Promise<TelegramResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/sendLocation`, {
        chat_id: this.chatId,
        latitude: latitude,
        longitude: longitude
      });

      return {
        ok: true,
        result: response.data.result
      };
    } catch (error: unknown) {
      console.error('Error sending Telegram location:', error);
      const errorInfo = getErrorInfo(error);
      return {
        ok: false,
        error_code: errorInfo.error_code,
        description: errorInfo.description
      };
    }
  }

  /**
   * Send location with address information as a text message
   */
  async sendLocationWithAddress(location: TelegramLocation): Promise<TelegramResponse> {
    try {
      // First send the location
      const locationResult = await this.sendLocation(location.latitude, location.longitude);
      
      if (!locationResult.ok) {
        return locationResult;
      }

      // Then send address information if available
      if (location.address) {
        const addressMessage = `📍 <b>Lokasi:</b>\n${location.address}\n\n🌐 <b>Koordinat:</b>\nLatitude: ${location.latitude}\nLongitude: ${location.longitude}`;
        return await this.sendMessage(addressMessage);
      }

      return locationResult;
    } catch (error: unknown) {
      console.error('Error sending location with address:', error);
      return {
        ok: false,
        error_code: 500,
        description: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Test the bot connection
   */
  async testConnection(): Promise<TelegramResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/getMe`);
      return {
        ok: true,
        result: response.data.result
      };
    } catch (error: unknown) {
      console.error('Error testing Telegram connection:', error);
      const errorInfo = getErrorInfo(error);
      return {
        ok: false,
        error_code: errorInfo.error_code,
        description: errorInfo.description
      };
    }
  }
}

export default TelegramService;