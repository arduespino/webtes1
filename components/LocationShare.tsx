'use client';

import { useState } from 'react';
import BrowserLocationShare from './BrowserLocationShare';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationShareProps {
  onShareLocation: (location: LocationData) => Promise<void>;
  isLoading: boolean;
}

export default function LocationShare({ onShareLocation, isLoading }: LocationShareProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showAlternatives, setShowAlternatives] = useState(false);

  // Predefined popular locations
  const predefinedLocations = [
    { name: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456 },
    { name: 'Surabaya, Indonesia', lat: -7.2575, lng: 112.7521 },
    { name: 'Bandung, Indonesia', lat: -6.9175, lng: 107.6191 },
    { name: 'Medan, Indonesia', lat: 3.5952, lng: 98.6722 },
    { name: 'Yogyakarta, Indonesia', lat: -7.7956, lng: 110.3695 },
    { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
    { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
  ];

  const selectPredefinedLocation = async (location: { name: string; lat: number; lng: number }) => {
    try {
      const locationData: LocationData = {
        latitude: location.lat,
        longitude: location.lng,
        address: location.name
      };
      
      setCurrentLocation(locationData);
      setShowAlternatives(false);
      setLocationError(null);
    } catch (error) {
      console.error('Error setting predefined location:', error);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setShowAlternatives(true);
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const address = await getAddressFromCoordinates(latitude, longitude);
          const locationData: LocationData = {
            latitude,
            longitude,
            address
          };
          
          setCurrentLocation(locationData);
          setIsGettingLocation(false);
          setLocationError(null);
        } catch (error) {
          console.error('Error getting address:', error);
          const locationData: LocationData = {
            latitude,
            longitude
          };
          setCurrentLocation(locationData);
          setIsGettingLocation(false);
          setLocationError(null);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsGettingLocation(false);
        
        let errorMessage = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was permanently denied. Please use manual entry or browser location sharing below.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please use manual entry option.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Try manual entry or refresh the page.';
            break;
          default:
            errorMessage = 'Location access failed. Use the alternative options below.';
            break;
        }
        
        setLocationError(errorMessage);
        setShowAlternatives(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.display_name || `${lat}, ${lng}`;
      } else {
        return `${lat}, ${lng}`;
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return `${lat}, ${lng}`;
    }
  };

  const handleManualLocation = async () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid latitude and longitude values');
      return;
    }
    
    if (lat < -90 || lat > 90) {
      alert('Latitude must be between -90 and 90');
      return;
    }
    
    if (lng < -180 || lng > 180) {
      alert('Longitude must be between -180 and 180');
      return;
    }
    
    try {
      const address = await getAddressFromCoordinates(lat, lng);
      const locationData: LocationData = {
        latitude: lat,
        longitude: lng,
        address
      };
      
      setCurrentLocation(locationData);
      setShowManualInput(false);
      setManualLat('');
      setManualLng('');
    } catch (error) {
      console.error('Error processing manual location:', error);
      const locationData: LocationData = {
        latitude: lat,
        longitude: lng
      };
      setCurrentLocation(locationData);
      setShowManualInput(false);
      setManualLat('');
      setManualLng('');
    }
  };

  const handleShareLocation = async () => {
    if (currentLocation) {
      await onShareLocation(currentLocation);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        📍 Share Location to Telegram
      </h2>
      
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Location Access Requirements
          </h4>
          <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
            <p>• Browser must allow location access</p>
            <p>• HTTPS connection recommended for security</p>
            <p>• Device location services must be enabled</p>
            <p>• If automatic detection fails, use alternatives below</p>
          </div>
        </div>

        {!currentLocation ? (
          <div className="space-y-4">
            {locationError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                      Location Access Blocked
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-400">{locationError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get your current location to share with Telegram
              </p>
              <button
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 mx-auto mb-3"
              >
                {isGettingLocation ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Getting Location...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Get My Location
                  </>
                )}
              </button>
              
              {(locationError || showAlternatives) && (
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Alternative Options:
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">📍 Choose a City</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {predefinedLocations.map((location, index) => (
                        <button
                          key={index}
                          onClick={() => selectPredefinedLocation(location)}
                          className="text-left p-2 text-sm bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded hover:bg-blue-50 dark:hover:bg-gray-500 transition-colors"
                        >
                          {location.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    or
                  </div>
                  
                  <button
                    onClick={() => setShowManualInput(!showManualInput)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline"
                  >
                    Enter exact coordinates manually
                  </button>
                </div>
              )}
              
              {!locationError && !showAlternatives && (
                <>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    or
                  </div>
                  
                  <button
                    onClick={() => setShowAlternatives(true)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline"
                  >
                    Browse location alternatives
                  </button>
                </>
              )}
            </div>
            
            {showManualInput && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Manual Location Entry</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g., -6.2000"
                      value={manualLat}
                      onChange={(e) => setManualLat(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g., 106.8000"
                      value={manualLng}
                      onChange={(e) => setManualLng(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleManualLocation}
                    disabled={!manualLat || !manualLng}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded-md transition-colors duration-200 text-sm"
                  >
                    Use These Coordinates
                  </button>
                  <button
                    onClick={() => {
                      setShowManualInput(false);
                      setManualLat('');
                      setManualLng('');
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-3 rounded-md transition-colors duration-200 text-sm"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tip: You can get coordinates from Google Maps by right-clicking on a location
                </p>
              </div>
            )}
            
            {(locationError || showAlternatives) && (
              <BrowserLocationShare
                onLocationReceived={(lat, lng, address) => {
                  const locationData: LocationData = {
                    latitude: lat,
                    longitude: lng,
                    address
                  };
                  setCurrentLocation(locationData);
                  setLocationError(null);
                  setShowAlternatives(false);
                }}
              />
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Your Location:</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <strong>Coordinates:</strong> {currentLocation?.latitude.toFixed(6)}, {currentLocation?.longitude.toFixed(6)}
              </p>
              {currentLocation?.address && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Address:</strong> {currentLocation.address}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleShareLocation}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send to Telegram
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setCurrentLocation(null);
                  setShowManualInput(false);
                  setManualLat('');
                  setManualLng('');
                  setLocationError(null);
                  setShowAlternatives(false);
                }}
                disabled={isLoading}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}