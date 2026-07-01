'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Sighting } from '@/types/sighting';
import { useGeolocationContext } from '@/context/GeolocationContext';

// Fix typical Leaflet bug with default markers
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// A custom icon for cats
const createCatIcon = (color: string) => L.divIcon({
  className: 'cat-marker',
  html: `<div style="background-color: ${color}; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1.1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/></svg></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

interface CatMapProps {
  userLocation?: { latitude: number; longitude: number } | null;
  sightings: Sighting[];
}

function LocationUpdater() {
  const map = useMap();
  const { latitude, longitude } = useGeolocationContext();

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      map.setView([latitude, longitude], 14, { animate: true });
    }
  }, [latitude, longitude, map]);
  return null;
}

export default function CatMap({ userLocation, sightings }: CatMapProps) {
  const center: [number, number] = userLocation ? [userLocation.latitude, userLocation.longitude] : [51.505, -0.09];

  return (
    <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%', zIndex: 0 }}>
      {/* Light slate styled map tiles instead of default */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      {userLocation && (
        <>
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={icon}>
            <Popup>Você está aqui</Popup>
          </Marker>
          <LocationUpdater />
        </>
      )}

      {sightings.map((sighting, idx) => {
        // Red for first one (Missing), Emerald for others (Spotted)
        const isMissing = sighting.status === 'stray';
        const color = isMissing ? '#ef4444' : '#10b981'; // text-red-500 and text-emerald-500

        return (
          <Marker 
            key={sighting.id} 
            position={[sighting.latitude, sighting.longitude]} 
            icon={createCatIcon(color)}
          >
            <Popup className="cat-popup">
              <div className="w-48 font-sans">
                {sighting.imageUrl && (
                  <img src={sighting.imageUrl} alt="Cat" className="w-full h-32 object-cover rounded-md mb-2 border border-slate-200" />
                )}
                <div className="flex justify-between items-start mb-1">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${isMissing ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {isMissing ? 'Na Rua' : 'Avistado'}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1 leading-tight">{sighting.coatColor}</h3>
                {sighting.notes && <p className="text-xs text-slate-500 line-clamp-2">{sighting.notes}</p>}
                
                <a href={`/sightings/${sighting.id}`} className="block mt-3 text-center text-[11px] font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-700 bg-indigo-50 border border-indigo-100 rounded py-1.5 transition-colors">
                  Ver Detalhes
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
