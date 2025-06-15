"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Search, Navigation, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";

export function LocationPicker({
  address = "",
  latitude = "",
  longitude = "",
  onLocationChange,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(address);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    address: address,
    lat: parseFloat(latitude) || null,
    lng: parseFloat(longitude) || null,
  });
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapContainerRef = useRef(null);

  // Initialize map function with useCallback
  const initializeMap = useCallback(() => {
    if (!window.L || !mapContainerRef.current || mapRef.current) return;

    try {
      // Default to Delhi center if no coordinates provided
      const defaultLat = selectedLocation.lat || 28.6139;
      const defaultLng = selectedLocation.lng || 77.209;

      // Create map instance
      const map = window.L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      mapRef.current = map;

      // Add OpenStreetMap tiles
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // Add marker
      const marker = window.L.marker([defaultLat, defaultLng], {
        draggable: true,
      }).addTo(map);

      markerRef.current = marker;

      // Handle marker drag events
      marker.on("dragend", () => {
        const position = marker.getLatLng();
        reverseGeocode(position.lat, position.lng);
      });

      // Handle map click events
      map.on("click", (e) => {
        marker.setLatLng(e.latlng);
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      });
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [selectedLocation]);

  // Load Leaflet function with useCallback
  const loadLeaflet = useCallback(() => {
    // Load CSS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      css.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      css.crossOrigin = "";
      document.head.appendChild(css);
    }

    // Load JS
    if (!document.querySelector('script[src*="leaflet.js"]')) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.onload = () => {
        setMapLoaded(true);
        setTimeout(initializeMap, 100);
      };
      script.onerror = () => {
        console.error("Failed to load Leaflet");
      };
      document.head.appendChild(script);
    }
  }, [initializeMap]);

  // Update selectedLocation when props change
  useEffect(() => {
    setSelectedLocation({
      address: address,
      lat: parseFloat(latitude) || null,
      lng: parseFloat(longitude) || null,
    });
    setSearchQuery(address);
  }, [address, latitude, longitude]);

  // Load Leaflet when modal opens
  useEffect(() => {
    if (isOpen && !window.L && !mapLoaded) {
      loadLeaflet();
    } else if (isOpen && window.L && !mapRef.current) {
      setTimeout(initializeMap, 100);
    }
  }, [isOpen, mapLoaded, loadLeaflet, initializeMap]);

  const updateLocation = async (lat, lng) => {
    try {
      setLoading(true);
      // Reverse geocoding to get address from coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();

      const newLocation = {
        address: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        lat: lat,
        lng: lng,
      };

      setSelectedLocation(newLocation);
      setSearchQuery(newLocation.address);

      if (onLocationChange) {
        onLocationChange({
          address: newLocation.address,
          latitude: lat.toString(),
          longitude: lng.toString(),
          mapLink: `https://www.google.com/maps?q=${lat},${lng}`,
        });
      }
    } catch (error) {
      console.error("Error getting address:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchLocations = async (query) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&countrycodes=in&addressdetails=1`
      );
      const data = await response.json();

      setSuggestions(
        data.map((item) => ({
          id: item.place_id,
          address: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        }))
      );
    } catch (error) {
      console.error("Error searching locations:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Debounced search
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    window.searchTimeout = setTimeout(() => {
      searchLocations(value);
    }, 500);
  };

  const selectSuggestion = (suggestion) => {
    setSelectedLocation(suggestion);
    setSearchQuery(suggestion.address);
    setSuggestions([]);

    // Update map if open
    if (mapRef.current && markerRef.current) {
      mapRef.current.setView([suggestion.lat, suggestion.lng], 15);
      markerRef.current.setLatLng([suggestion.lat, suggestion.lng]);
    }

    if (onLocationChange) {
      onLocationChange({
        address: suggestion.address,
        latitude: suggestion.lat.toString(),
        longitude: suggestion.lng.toString(),
        mapLink: `https://www.google.com/maps?q=${suggestion.lat},${suggestion.lng}`,
      });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateLocation(latitude, longitude);

          if (mapRef.current && markerRef.current) {
            mapRef.current.setView([latitude, longitude], 15);
            markerRef.current.setLatLng([latitude, longitude]);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    }
  };

  const confirmLocation = () => {
    if (onLocationChange && selectedLocation.lat && selectedLocation.lng) {
      onLocationChange({
        address: selectedLocation.address,
        latitude: selectedLocation.lat.toString(),
        longitude: selectedLocation.lng.toString(),
        mapLink: `https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`,
      });
    }
    setIsOpen(false);
  };

  const handleModalClose = () => {
    setIsOpen(false);
    // Clean up map
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markerRef.current = null;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Location Display / Trigger */}
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-[#5e4cbb] transition-colors bg-white"
      >
        <MapPin className="h-5 w-5 text-[#5e4cbb] mr-3" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            {selectedLocation.address || "Click to select location"}
          </p>
          {selectedLocation.lat && selectedLocation.lng && (
            <p className="text-xs text-gray-500">
              {selectedLocation.lat.toFixed(6)},{" "}
              {selectedLocation.lng.toFixed(6)}
            </p>
          )}
        </div>
        <Search className="h-4 w-4 text-gray-400" />
      </div>

      {/* Location Picker Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Property Location
              </h3>
              <button
                onClick={handleModalClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for address, landmark, or area..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-20"
                />
                <Button
                  onClick={getCurrentLocation}
                  disabled={loading}
                  className="absolute right-2 top-1 h-8 px-3 text-xs bg-[#5e4cbb] hover:bg-[#4a3d99]"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  Current
                </Button>
              </div>

              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-lg">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-[#5e4cbb] mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-900">
                          {suggestion.address}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Map Container */}
            <div className="relative h-96">
              <div
                ref={mapContainerRef}
                id="location-map"
                className="w-full h-full"
                style={{ minHeight: "384px" }}
              />

              {/* Loading Overlay */}
              {loading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#5e4cbb] border-t-transparent"></div>
                </div>
              )}

              {/* Instructions */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <p className="text-xs text-gray-600">
                  📍 Click on map or drag marker to set location
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                {selectedLocation.lat && selectedLocation.lng ? (
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    Location selected
                  </span>
                ) : (
                  "Please select a location"
                )}
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleModalClose}>
                  Cancel
                </Button>
                <Button
                  onClick={confirmLocation}
                  disabled={!selectedLocation.lat || !selectedLocation.lng}
                  className="bg-[#5e4cbb] hover:bg-[#4a3d99]"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationPicker;
