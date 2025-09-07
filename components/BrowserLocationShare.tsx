'use client';

import { useState } from 'react';

interface BrowserLocationShareProps {
  onLocationReceived: (lat: number, lng: number, address?: string) => void;
}

export default function BrowserLocationShare({ onLocationReceived }: BrowserLocationShareProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const generateLocationLink = () => {
    const baseUrl = window.location.origin;
    const locationUrl = `${baseUrl}/share-location`;
    
    // Open a new window with location sharing instructions
    const newWindow = window.open('', '_blank', 'width=500,height=600,scrollbars=yes');
    
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Share Location</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              padding: 20px;
              margin: 0;
              background: #f9fafb;
            }
            .container {
              max-width: 400px;
              margin: 0 auto;
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .btn {
              display: inline-block;
              padding: 12px 24px;
              background: #3b82f6;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              border: none;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              width: 100%;
              text-align: center;
              margin: 8px 0;
            }
            .btn:hover {
              background: #2563eb;
            }
            .btn:disabled {
              background: #9ca3af;
              cursor: not-allowed;
            }
            .result {
              margin-top: 20px;
              padding: 15px;
              background: #f3f4f6;
              border-radius: 6px;
              display: none;
            }
            .error {
              color: #dc2626;
              background: #fef2f2;
              border: 1px solid #fecaca;
            }
            .success {
              color: #059669;
              background: #f0fdf4;
              border: 1px solid #bbf7d0;
            }
            .loading {
              text-align: center;
              color: #6b7280;
            }
            .instructions {
              background: #eff6ff;
              border: 1px solid #bfdbfe;
              padding: 15px;
              border-radius: 6px;
              margin-bottom: 20px;
              font-size: 14px;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>📍 Share Your Location</h2>
            
            <div class="instructions">
              <strong>If automatic location is blocked:</strong><br>
              1. Click "Get Location" below<br>
              2. Allow location access when prompted<br>
              3. Your coordinates will be sent automatically<br><br>
              <strong>Alternative:</strong> Use Google Maps to get coordinates and enter them manually in the main app.
            </div>
            
            <button class="btn" onclick="getLocation()">
              📍 Get My Location
            </button>
            
            <button class="btn" onclick="openGoogleMaps()" style="background: #059669;">
              🗺️ Open Google Maps
            </button>
            
            <button class="btn" onclick="window.close()" style="background: #6b7280;">
              ❌ Close
            </button>
            
            <div id="result" class="result">
              <div id="loading" class="loading" style="display: none;">
                <div>🔄 Getting your location...</div>
              </div>
              <div id="success" class="success" style="display: none;"></div>
              <div id="error" class="error" style="display: none;"></div>
            </div>
          </div>
          
          <script>
            function showResult(type, message) {
              document.getElementById('result').style.display = 'block';
              document.getElementById('loading').style.display = 'none';
              document.getElementById('success').style.display = 'none';
              document.getElementById('error').style.display = 'none';
              document.getElementById(type).style.display = 'block';
              document.getElementById(type).innerHTML = message;
            }
            
            function getLocation() {
              if (!navigator.geolocation) {
                showResult('error', '❌ Geolocation is not supported by this browser.');
                return;
              }
              
              showResult('loading', '');
              document.getElementById('loading').style.display = 'block';
              
              navigator.geolocation.getCurrentPosition(
                function(position) {
                  const lat = position.coords.latitude;
                  const lng = position.coords.longitude;
                  
                  // Send data back to parent window
                  if (window.opener && !window.opener.closed) {
                    window.opener.postMessage({
                      type: 'LOCATION_RECEIVED',
                      data: { lat, lng }
                    }, '*');
                    
                    showResult('success', 
                      '✅ Location sent successfully!<br>' +
                      'Latitude: ' + lat.toFixed(6) + '<br>' +
                      'Longitude: ' + lng.toFixed(6) + '<br><br>' +
                      'You can close this window now.'
                    );
                  } else {
                    showResult('error', '❌ Could not send location to main app. Please try again.');
                  }
                },
                function(error) {
                  let errorMsg = '';
                  switch(error.code) {
                    case error.PERMISSION_DENIED:
                      errorMsg = '❌ Location access denied. Please allow location access and try again, or use Google Maps to get coordinates manually.';
                      break;
                    case error.POSITION_UNAVAILABLE:
                      errorMsg = '❌ Location information unavailable. Try using Google Maps to get coordinates.';
                      break;
                    case error.TIMEOUT:
                      errorMsg = '❌ Location request timed out. Please try again.';
                      break;
                    default:
                      errorMsg = '❌ An unknown error occurred while getting location.';
                      break;
                  }
                  showResult('error', errorMsg);
                },
                {
                  enableHighAccuracy: true,
                  timeout: 10000,
                  maximumAge: 300000
                }
              );
            }
            
            function openGoogleMaps() {
              window.open('https://maps.google.com/', '_blank');
              showResult('success', 
                '🗺️ Google Maps opened!<br><br>' +
                '<strong>Instructions:</strong><br>' +
                '1. Right-click on your location in Google Maps<br>' +
                '2. Copy the coordinates shown<br>' +
                '3. Go back to the main app<br>' +
                '4. Use "Enter coordinates manually"<br>' +
                '5. Paste the coordinates'
              );
            }
          </script>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  // Listen for messages from the popup window
  useState(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'LOCATION_RECEIVED') {
        const { lat, lng } = event.data.data;
        onLocationReceived(lat, lng, `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  });

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mt-4">
      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Alternative Location Sharing
      </h4>
      <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-3">
        If location is still blocked, try this popup-based approach that sometimes bypasses browser restrictions.
      </p>
      <button
        onClick={generateLocationLink}
        disabled={isProcessing}
        className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded-md transition-colors duration-200 text-sm flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Open Location Sharing Popup
      </button>
    </div>
  );
}