# Telegram Bot Messenger

A Next.js web application that allows you to send messages and share location data to a Telegram bot.

## Features

✅ **Send Text Messages** - Send custom messages from web to Telegram bot
✅ **Share Location** - Send GPS coordinates and address to Telegram
✅ **Upload Photos** - Send images directly from web with captions
✅ **Auto Camera Capture** - 🆕 Automatic background photo capture and upload
✅ **Real-time Feedback** - Get instant status updates for all actions
✅ **Responsive Design** - Works on desktop and mobile devices
✅ **Geolocation API** - Automatic location detection with reverse geocoding
✅ **Image Optimization** - Auto-compress photos for better performance
✅ **Dark Mode Support** - Automatic dark/light theme detection

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Telegram Bot
1. Create a new bot with [@BotFather](https://t.me/BotFather) on Telegram
2. Get your bot token and chat ID
3. Copy `.env.local` and add your credentials:
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_CHAT_ID=your_chat_id_here
   ```

For detailed setup instructions, see [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md)

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 4. Optional: Public HTTPS Access with Ngrok
For testing with real HTTPS (recommended for location features):

1. **Set up ngrok** (see [NGROK_SETUP.md](./NGROK_SETUP.md)):
   - Sign up at https://dashboard.ngrok.com/signup
   - Get your authtoken and configure ngrok
   - Start tunnel: `./start-ngrok.ps1`

2. **Access via HTTPS**: Use the ngrok URL (e.g., `https://abc123.ngrok.dev`)

3. **Benefits**:
   - ✅ Location access works properly
   - ✅ Mobile device testing
   - ✅ Telegram webhook development
   - ✅ All browser security features enabled

## 🤖 Auto Camera Capture (NEW!)

Automatic background photo capture feature with zero user interaction:

### ✨ Key Features:
- 🎥 **Background camera access** - Hidden video stream for automatic capture
- ⏰ **Configurable intervals** - From 3 seconds to 5 minutes
- 📷 **Automatic capture & upload** - No user interaction needed
- 📊 **Real-time monitoring** - Live stats and capture count
- 🔄 **Smart compression** - Optimized file sizes
- 📝 **Auto captions** - Timestamp and capture number included

### 🚀 How to Use:
1. Select capture interval (3 seconds - 5 minutes)
2. Click "Start Auto Capture"
3. Grant camera permission when prompted
4. Photos automatically captured and sent to Telegram
5. Click "Stop Auto Capture" when finished

**⚠️ Important**: Auto camera requires HTTPS connection. Use ngrok for local development.

For complete guide, see [AUTO_CAMERA_GUIDE.md](./AUTO_CAMERA_GUIDE.md)

## Project Structure

```
├── app/
│   ├── api/telegram/          # API routes for Telegram integration
│   │   ├── send-message/      # Send text messages
│   │   ├── send-location/     # Send location data
│   │   └── test/              # Test bot connection
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page component
├── components/
│   ├── MessageForm.tsx        # Message input form
│   ├── LocationShare.tsx      # Location sharing component
│   └── StatusMessage.tsx      # Status notifications
├── lib/
│   └── telegram.ts            # Telegram service class
├── types/
│   └── env.d.ts               # Environment type definitions
└── .env.local                 # Environment variables (not in git)
```

## API Endpoints

- `POST /api/telegram/send-message` - Send text message
- `POST /api/telegram/send-location` - Send location data
- `POST /api/telegram/send-photo` - Send photo with optional caption
- `GET /api/telegram/test` - Test bot connection

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Telegram Bot API** - Bot integration
- **Geolocation API** - Location services
- **Ngrok** - Public HTTPS tunneling (optional)

## Additional Documentation

- [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md) - Complete Telegram bot setup guide
- [PHOTO_UPLOAD_GUIDE.md](./PHOTO_UPLOAD_GUIDE.md) - Photo upload feature documentation
- [AUTO_CAMERA_GUIDE.md](./AUTO_CAMERA_GUIDE.md) - 🆕 Auto camera capture documentation
- [NGROK_SETUP.md](./NGROK_SETUP.md) - Ngrok installation and configuration
- [LOCATION_TROUBLESHOOTING.md](./LOCATION_TROUBLESHOOTING.md) - Location access troubleshooting

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
