# 🚇 Ngrok Setup Guide for Telegram Bot

## ✅ Ngrok Successfully Installed!

Ngrok version 3.3.1 has been installed on your system. Here's how to set it up and use it with your Telegram bot application.

## 🔑 Step 1: Create Free Ngrok Account

1. **Sign up for free account:**
   - Visit: https://dashboard.ngrok.com/signup
   - Create account with email
   - Verify your email address

2. **Get your authtoken:**
   - Visit: https://dashboard.ngrok.com/get-started/your-authtoken
   - Copy your personal authtoken

## 🛠️ Step 2: Configure Ngrok

Run this command in your terminal (replace YOUR_AUTHTOKEN with your actual token):

```bash
# Configure ngrok with your authtoken
& "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe" config add-authtoken YOUR_AUTHTOKEN
```

## 🚀 Step 3: Start Ngrok Tunnel

With your Next.js development server running on port 3000, start ngrok:

```bash
# Start ngrok tunnel to your local server
& "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe" http 3000
```

You'll get output like:
```
ngrok                                                               
                                                                    
Visit http://localhost:4040 for ngrok inspector                   
                                                                    
Session Status                online                               
Account                       your-email@example.com              
Version                       3.3.1                               
Region                        United States (us)                  
Latency                       45ms                                
Web Interface                 http://127.0.0.1:4040              
Forwarding                    https://abc123.ngrok.dev -> http://localhost:3000

Session Expires               1 hour, 59 minutes  
```

## 🌐 Step 4: Use Your Public URL

Your app is now available at the public HTTPS URL (e.g., `https://abc123.ngrok.dev`)

### Benefits for Telegram Bot:

1. **HTTPS by Default**: Perfect for location access
2. **Public Access**: Telegram webhooks can reach your bot
3. **Real Device Testing**: Test on mobile devices
4. **Webhook Development**: Perfect for bot development

## 📱 Step 5: Test Your Telegram Bot

1. **Access your app**: Visit the ngrok URL (e.g., `https://abc123.ngrok.dev`)
2. **Location will work**: HTTPS means geolocation API works
3. **Mobile testing**: Share URL with mobile devices
4. **Telegram webhooks**: Use the ngrok URL for webhook endpoints

## 🛡️ Security Features

### Free Plan Limitations:
- **Session Duration**: 2 hours per session
- **Concurrent Tunnels**: 1 tunnel
- **Custom Domains**: Not available
- **Bandwidth**: 1GB/month

### Upgrade Benefits:
- **Longer Sessions**: 8+ hours
- **Custom Domains**: Use your own domain
- **Multiple Tunnels**: Run several simultaneously
- **More Bandwidth**: Higher limits

## 🔧 Advanced Usage

### Custom Subdomain (Paid Plan):
```bash
ngrok http --domain=mybot.ngrok.dev 3000
```

### Basic Authentication:
```bash
ngrok http --basic-auth="username:password" 3000
```

### Custom Headers:
```bash
ngrok http --host-header=myapp.com 3000
```

## 🎯 Integration with Your App

### Environment Variables Update:

When using ngrok, you can update your webhook URLs:

```env
# .env.local
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# For webhook development (optional)
NGROK_URL=https://abc123.ngrok.dev
```

### Webhook Setup (if using Telegram webhooks):

```typescript
// Set webhook URL to ngrok tunnel
const webhookUrl = process.env.NGROK_URL + '/api/telegram/webhook';
```

## 🎉 Quick Start Commands

1. **Start your Next.js app:**
   ```bash
   npm run dev
   ```

2. **In another terminal, start ngrok:**
   ```bash
   & "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe" http 3000
   ```

3. **Access your app:** Visit the ngrok HTTPS URL

## 🔍 Monitoring & Debugging

### Ngrok Web Interface:
- Local URL: http://localhost:4040
- View all requests/responses
- Replay requests
- Monitor traffic

### Common Issues:

**"authentication failed"**
- Solution: Add your authtoken with the config command

**"tunnel not found"**
- Solution: Ensure your Next.js server is running on port 3000

**"account limit exceeded"**
- Solution: Only one tunnel allowed on free plan

## 💡 Tips for Development

1. **Keep URLs handy**: Save your ngrok URL for easy access
2. **Use inspector**: Monitor all HTTP traffic at localhost:4040
3. **Mobile testing**: Share ngrok URL for mobile device testing
4. **HTTPS benefits**: All browser features work (geolocation, etc.)

## 🔄 Session Management

**Free plan sessions expire after 2 hours. To restart:**

1. Stop ngrok (Ctrl+C)
2. Restart: `ngrok http 3000`
3. Note the new URL (it changes each restart)

**For persistent URLs, consider upgrading to a paid plan.**

---

Your Telegram bot application now has public HTTPS access! This solves location access issues and enables full testing of all features.