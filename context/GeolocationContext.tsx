'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface GeoState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

interface GeolocationContextType extends GeoState {
  retry: () => void;
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(undefined);

export function GeolocationProvider({ children }: { children: ReactNode }) {
  const [geoState, setGeoState] = useState<GeoState>({
    latitude: null,
    longitude: null,
    loading: true,
    error: null,
  });

  const getPosition = () => {
    setGeoState(prev => ({ ...prev, loading: true, error: null }));
    if (!navigator.geolocation) {
      setGeoState({
        latitude: null,
        longitude: null,
        loading: false,
        error: 'A geolocalização não é suportada pelo seu navegador',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setGeoState({
          latitude: null,
          longitude: null,
          loading: false,
          error: error.message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    let mounted = true;
    
    if (!navigator.geolocation) {
      setTimeout(() => {
        if (mounted) {
          setGeoState({
            latitude: null,
            longitude: null,
            loading: false,
            error: 'A geolocalização não é suportada pelo seu navegador',
          });
        }
      }, 0);
      return;
    }

    // Don't call setGeoState loading here synchronously
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (mounted) {
          setGeoState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            loading: false,
            error: null,
          });
        }
      },
      (error) => {
        if (mounted) {
          setGeoState({
            latitude: null,
            longitude: null,
            loading: false,
            error: error.message,
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <GeolocationContext.Provider value={{ ...geoState, retry: getPosition }}>
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeolocationContext() {
  const context = useContext(GeolocationContext);
  if (context === undefined) {
    throw new Error('useGeolocationContext must be used within a GeolocationProvider');
  }
  return context;
}
