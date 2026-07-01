'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Info, X, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Sighting } from '@/types/sighting';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-utils';
import { useAddress } from '@/hooks/useAddress';

const MiniMap = dynamic(() => import('@/components/map/MiniMap'), { ssr: false });

export default function SightingDetail() {
  const params = useParams();
  const router = useRouter();
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [sighting, setSighting] = useState<Sighting | null>(null);
  const [loading, setLoading] = useState(true);

  const id = params.id as string;

  useEffect(() => {
    const fetchSighting = async () => {
      try {
        const docRef = doc(db, 'sightings', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSighting({
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
          } as Sighting);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `sightings/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchSighting();
  }, [id]);

  const { address, loading: addressLoading } = useAddress(sighting?.latitude, sighting?.longitude);

  if (loading) {
    return <div className="h-full w-full flex items-center justify-center bg-slate-50 relative border-x border-slate-200 max-w-[1024px] mx-auto shadow-2xl overflow-hidden"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  const s = sighting;

  if (!s) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 relative border-x border-slate-200 max-w-[1024px] mx-auto shadow-2xl overflow-hidden">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Avistamento Não Encontrado</h2>
        <button onClick={() => router.push('/')} className="text-indigo-600 font-semibold hover:underline">Voltar para o mapa</button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 h-full w-full overflow-y-auto flex flex-col pb-20 font-sans text-slate-900 border-x border-slate-200 max-w-[1024px] mx-auto shadow-2xl relative">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md px-6 h-16 absolute top-0 left-0 right-0 z-30 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full bg-white/80 shadow-sm border border-slate-200 text-slate-700 hover:bg-white transition-colors"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-sm font-bold tracking-tight text-slate-800 opacity-0 transition-opacity">Detalhes do Avistamento</h1>
      </div>

      <div className="w-full flex flex-col">
        {/* Photo */}
        <div 
          className="w-full h-80 bg-slate-900 relative border-b border-slate-200 cursor-zoom-in"
          onClick={() => setIsImageFullscreen(true)}
        >
          <img src={s.imageUrl} alt="Cat" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
        </div>

        {/* Fullscreen Image Overlay */}
        {isImageFullscreen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm cursor-zoom-out" onClick={() => setIsImageFullscreen(false)}>
            <img src={s.imageUrl} alt="Cat Fullscreen" className="max-w-full max-h-full object-contain p-4 select-none" />
            <button className="absolute top-6 right-6 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/80 transition-colors" onClick={() => setIsImageFullscreen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-white p-8 z-10 flex flex-col gap-8 max-w-2xl mx-auto w-full">
          
          <div className="flex items-start justify-between">
             <div className="flex flex-col gap-1.5">
                 <h2 className="text-3xl font-bold tracking-tight text-slate-900">Gato Avistado</h2>
                 <div className="flex items-center gap-2 text-slate-500 text-sm font-medium" suppressHydrationWarning>
                     <Calendar className="w-4 h-4 text-indigo-500" />
                     {s.createdAt ? new Date(s.createdAt).toLocaleString() : 'Agora mesmo'}
                 </div>
                 <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                     <MapPin className="w-4 h-4 text-indigo-500" />
                     {addressLoading ? 'Carregando localização...' : (address || 'Localização Desconhecida')}
                 </div>
             </div>
          </div>

          {/* Characteristics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Cor</span>
              <span className="text-slate-900 font-bold capitalize">{s.coatColor || 'Desconhecida'}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Padrão</span>
              <span className="text-slate-900 font-bold capitalize">{s.pattern || 'Desconhecido'}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tamanho</span>
              <span className="text-slate-900 font-bold capitalize">{s.size === 'kitten' ? 'Filhote' : s.size === 'small' ? 'Pequeno' : s.size === 'medium' ? 'Médio' : s.size === 'large' ? 'Grande' : 'Desconhecido'}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Status</span>
              <span className="text-slate-900 font-bold capitalize">{s.status === 'stray' ? 'Na rua' : s.status === 'owned' ? 'Tem dono' : 'Desconhecido'}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm col-span-2">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Coleira</span>
              <span className="text-slate-900 font-bold">{s.hasCollar === true ? 'Sim' : s.hasCollar === false ? 'Não' : 'Desconhecida'}</span>
            </div>
          </div>

          {/* Notes */}
          {s.notes && (
            <div className="flex flex-col gap-2 border-t border-slate-100 pt-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 tracking-tight uppercase text-xs">
                <Info className="w-4 h-4 text-indigo-500"/> Notas
              </h3>
              <p className="text-slate-600 text-sm bg-indigo-50/40 border border-indigo-100 p-5 rounded-xl leading-relaxed font-medium">
                {s.notes}
              </p>
            </div>
          )}

          {/* Location Map */}
          <div className="flex flex-col gap-2 border-t border-slate-100 pt-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 tracking-tight uppercase text-xs">
               <MapPin className="w-4 h-4 text-indigo-500"/> Visualização do Mapa
            </h3>
            <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200 relative flex items-center justify-center z-0">
               <MiniMap lat={s.latitude} lng={s.longitude} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
