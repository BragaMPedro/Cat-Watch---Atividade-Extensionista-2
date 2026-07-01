'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Loader2, Cat } from 'lucide-react';
import { Sighting } from '@/types/sighting';
import { useGeolocationContext } from '@/context/GeolocationContext';
import { SightingListItem } from '@/components/SightingListItem';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { OperationType, handleFirestoreError } from '@/lib/firestore-utils';
import { getDistanceInKm } from '@/lib/utils';

const CatMap = dynamic(
  () => import('@/components/map/CatMap'),
  { 
    loading: () => <div className="h-full w-full flex items-center justify-center bg-slate-100"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>,
    ssr: false 
  }
);

export default function Home() {
  const { latitude, longitude, loading: locLoading, error } = useGeolocationContext();
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loadingSightings, setLoadingSightings] = useState(true);
  const [showMobileList, setShowMobileList] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'sightings'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          createdAt: docData.createdAt ? docData.createdAt.toDate().toISOString() : new Date().toISOString()
        };
      }) as Sighting[];
      setSightings(data);
      setLoadingSightings(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'sightings');
      setLoadingSightings(false);
    });

    return () => unsubscribe();
  }, []);

  const displayLat = latitude ?? -43.18232940;
  const displayLng = longitude ?? -22.50463880;

  const filteredSightings = sightings.filter(s => getDistanceInKm(displayLat, displayLng, s.latitude, s.longitude) <= 2);

  return (
    <div className="flex flex-1 overflow-hidden w-full h-full">
      <aside className="w-96 bg-white border-r border-slate-200 flex flex-col z-10 shrink-0 hidden md:flex">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avistamentos Recentes</h2>
          <button className="text-xs text-indigo-600 font-semibold">Filtrar</button>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {loadingSightings ? (
            <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
          ) : filteredSightings.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">No nearby sightings reported yet.</div>
          ) : (
            filteredSightings.map((sighting) => (
              <SightingListItem key={sighting.id} sighting={sighting} />
            ))
          )}
        </div>
      </aside>

      <section className="flex-1 relative bg-slate-200 p-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CatMap 
            userLocation={{ latitude: displayLat, longitude: displayLng }} 
            sightings={filteredSightings} 
          />
        </div>

        {/* Stats overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-full shadow-xl border border-slate-200 px-6 py-4 items-center space-x-8 z-[2000] hidden sm:flex pointer-events-none">
          <div className="text-center">
            <div className="text-xl font-bold text-red-500">{filteredSightings.filter(s => s.status === 'stray').length}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Na Rua</div>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          <div className="text-center">
            <div className="text-xl font-bold text-emerald-500">{filteredSightings.length}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">A menos de 2 km</div>
          </div>
        </div>

        {/* Mobile Horizontal List */}
        <div className={`md:hidden absolute bottom-24 left-0 right-0 z-[2000] transition-all duration-300 ease-in-out ${showMobileList ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
          <div className="flex overflow-x-auto gap-4 px-6 pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {loadingSightings ? (
               <div className="w-full shrink-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-100 p-6 flex justify-center items-center">
                 <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
               </div>
            ) : filteredSightings.length === 0 ? (
               <div className="w-full shrink-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-100 p-6 text-center text-sm font-medium text-slate-500">
                 Nenhum avistamento próximo reportado ainda.
               </div>
            ) : (
              filteredSightings.map(sighting => (
                <div key={sighting.id} className="snap-center shrink-0 w-[85%] max-w-[320px] bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                  <SightingListItem sighting={sighting} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Floating Actions Mobile */}
        <div className="absolute bottom-6 left-6 right-6 z-[2000] flex justify-between items-end md:hidden pointer-events-none">
          <div className="pointer-events-auto">
            <button 
              className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg border-2 transition-all active:scale-95 ${showMobileList ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white hover:bg-slate-50 border-white text-slate-800'}`}
              onClick={() => setShowMobileList(!showMobileList)}
            >
              <Cat className="w-6 h-6" />
            </button>
          </div>
          <div className="pointer-events-auto">
            <Link href="/report" className="bg-indigo-600 text-white px-5 py-3 rounded-lg font-semibold text-sm shadow-lg border border-indigo-500 hover:bg-indigo-700 hover:shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center">
              Reportar Avistamento
            </Link>
          </div>
        </div>

        {/* Floating Actions Desktop */}
        <div className="absolute top-6 right-6 z-[2000] hidden md:block">
          <Link href="/report" className="bg-indigo-600 text-white px-5 py-3 rounded-lg font-semibold text-sm shadow-lg border border-indigo-500 hover:bg-indigo-700 hover:shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center">
            Reportar Avistamento
          </Link>
        </div>
      </section>
    </div>
  );
}
