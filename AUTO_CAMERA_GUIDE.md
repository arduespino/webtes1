# 🤖 Auto Camera Capture Feature

## Overview

The Auto Camera Capture feature allows your web application to automatically take photos using the device camera and send them to your Telegram bot at specified intervals, completely in the background without user interaction.

## ✨ Key Features

### 🎯 Fully Automated
- **No user interaction required** - Once started, runs completely automatically
- **Background operation** - Camera runs hidden in the background
- **Automatic uploads** - Photos are compressed and sent to Telegram immediately
- **Smart captions** - Auto-generated timestamps and capture count

### ⚙️ Configurable Settings
- **Flexible intervals**: 3 seconds to 5 minutes
- **Quality optimization**: Auto-compression for optimal file sizes
- **Camera selection**: Automatically uses best available camera
- **Error handling**: Comprehensive error detection and recovery

### 📊 Real-time Monitoring
- **Live stats**: Track number of photos sent
- **Status indicators**: Visual feedback for active capture
- **Last capture preview**: See the most recent photo taken
- **Timestamp tracking**: Know exactly when last photo was captured

## 🚀 How to Use

### 1. Start Auto Capture
1. Select your preferred capture interval (3 seconds to 5 minutes)
2. Click **"Start Auto Capture"**
3. Allow camera permission when prompted
4. The system will begin capturing and sending photos automatically

### 2. Monitor Progress
- Watch the **green status indicator** showing capture is active
- View **real-time stats** including photo count and last capture time
- See **preview of last captured photo**

### 3. Stop When Needed
- Click **"Stop Auto Capture"** to end the session
- Camera access is automatically released
- All background processes are cleaned up

## 🛠️ Technical Implementation

### Camera API Integration
```typescript
// Automatic camera access with optimal settings
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'environment' // Back camera preferred
  },
  audio: false
});
```

### Background Capture Process
```typescript
// Automated capture with interval timing
intervalRef.current = setInterval(() => {
  autoCapture(); // Capture → Compress → Send to Telegram
}, interval * 1000);
```

### Smart Image Processing
- **Auto-compression**: Reduces file size while maintaining quality
- **Format optimization**: Converts to JPEG for best Telegram compatibility
- **Size validation**: Ensures compliance with Telegram limits

## 📱 Browser Compatibility

### ✅ Fully Supported
- **Chrome 53+**: Full support with hardware acceleration
- **Firefox 36+**: Complete WebRTC implementation
- **Safari 11+**: Full getUserMedia support
- **Edge 12+**: Native camera access

### 📋 Requirements
- **HTTPS connection**: Required for camera access (use ngrok for local testing)
- **Camera permission**: User must grant access on first use
- **WebRTC support**: Modern browser with getUserMedia API

## 🔧 Troubleshooting

### Camera Access Issues
1. **Permission Denied**
   - Check browser permissions in settings
   - Ensure HTTPS connection (required for camera access)
   - Try reloading page and granting permission again

2. **No Camera Found**
   - Verify device has camera
   - Check if camera is being used by another application
   - Try different browser or incognito mode

3. **WebRTC Not Supported**
   - Update browser to latest version
   - Use supported browser (Chrome, Firefox, Safari, Edge)

### Performance Optimization
- **Shorter intervals** (3-5 seconds): Higher CPU usage, more photos
- **Longer intervals** (1-5 minutes): Better performance, fewer photos
- **Auto-compression**: Reduces bandwidth and storage requirements

## 🔒 Privacy & Security

### Data Protection
- **Local processing**: All image processing happens on device
- **Direct upload**: Photos sent directly to your Telegram bot
- **No storage**: Images not saved locally after sending
- **Camera control**: Full user control over start/stop

### Best Practices
- ✅ Always inform users when auto-capture is active
- ✅ Provide clear start/stop controls
- ✅ Use appropriate capture intervals for your use case
- ✅ Monitor data usage for mobile connections

## 💡 Use Cases

### 🏠 Security Monitoring
- Automatic surveillance photos
- Motion detection alerts
- Remote property monitoring

### 📊 Time-lapse Creation
- Progress documentation
- Event recording
- Scientific observations

### 🔍 Quality Control
- Manufacturing process monitoring
- Lab experiment tracking
- Regular status updates

## ⚡ Advanced Features

### Auto-Generated Captions
Each photo includes:
```
🤖 Auto capture #15
📅 1/8/2025
🕐 2:30:45 PM
```

### Smart Compression
- Files over 8MP: Resize to 1920x1080, 70% quality
- Files over 4MP: Resize to 1920x1080, 80% quality
- Smaller files: Minimal compression, preserve quality

### Error Recovery
- Automatic retry on capture failure
- Camera reconnection on stream loss
- Fallback to original image if compression fails

## 🎯 Quick Start Commands

```bash
# Start development server with HTTPS (required for camera)
npm run dev

# Use ngrok for public HTTPS access
ngrok http 3000
```

## 📞 Support

For issues with auto camera capture:
1. Check browser console for detailed error messages
2. Verify HTTPS connection is active
3. Test camera access in browser settings
4. Try different capture intervals if experiencing performance issues

**Remember**: This feature requires camera permission and HTTPS connection to function properly!