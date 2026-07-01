'use client';

import React from 'react';
import { useGeolocationContext } from '@/context/GeolocationContext';
import { Loader2, MapPin, RefreshCw } from 'lucide-react';

export function HeaderLocation() {
  const { latitude, longitude, loading, error, retry } = useGeolocationContext();

  return (
    <div 
      className={`flex items-center px-3 sm:px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
        error ? 'bg-red-50 border-red-200 text-red-700 cursor-pointer hover:bg-red-100' : 'bg-slate-100 border-slate-200 text-slate-700'
      }`}
      onClick={error ? retry : undefined}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 sm:mr-2 text-indigo-500 animate-spin" />
          <span className="hidden sm:inline">Localizando...</span>
        </>
      ) : error ? (
        <>
          <RefreshCw className="h-4 w-4 sm:mr-2 text-red-500" />
          <span className="hidden sm:inline">Toque para localizar</span>
        </>
      ) : (
        <>
          <MapPin className="h-4 w-4 sm:mr-2 text-indigo-500" />
          <span className="font-mono text-xs hidden sm:inline">
            {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
          </span>
        </>
      )}
    </div>
  );
}
