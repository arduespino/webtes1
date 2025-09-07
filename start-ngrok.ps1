# Ngrok Helper Script for Telegram Bot Development
# Usage: .\start-ngrok.ps1

Write-Host "🚇 Starting Ngrok for Telegram Bot Application..." -ForegroundColor Green

# Define ngrok path
$ngrokPath = "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe"

# Check if ngrok exists
if (-not (Test-Path $ngrokPath)) {
    Write-Host "❌ Ngrok not found at expected location!" -ForegroundColor Red
    Write-Host "Please ensure ngrok is installed correctly." -ForegroundColor Yellow
    exit 1
}

# Check if Next.js server is running on port 3000
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -TimeoutSec 5 -ErrorAction SilentlyContinue
    Write-Host "✅ Next.js server detected on port 3000" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Next.js server not detected on port 3000" -ForegroundColor Yellow
    Write-Host "Please ensure your development server is running:" -ForegroundColor Yellow
    Write-Host "  npm run dev" -ForegroundColor Cyan
    
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

Write-Host ""
Write-Host "📋 Instructions:" -ForegroundColor Cyan
Write-Host "1. If this is your first time, set up your authtoken:" -ForegroundColor White
Write-Host "   Visit: https://dashboard.ngrok.com/get-started/your-authtoken" -ForegroundColor Yellow
Write-Host "   Then run: ngrok config add-authtoken YOUR_TOKEN" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Your app will be available at the HTTPS URL shown below" -ForegroundColor White
Write-Host "3. Location access will work properly with HTTPS" -ForegroundColor White
Write-Host "4. Visit http://localhost:4040 for ngrok inspector" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Starting ngrok tunnel..." -ForegroundColor Green

# Start ngrok
try {
    & $ngrokPath http 3000
} catch {
    Write-Host "❌ Failed to start ngrok!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "- Make sure you have set up your authtoken" -ForegroundColor White
    Write-Host "- Check that port 3000 is not already tunneled" -ForegroundColor White
    Write-Host "- Verify your internet connection" -ForegroundColor White
}