'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CatSize } from '@/types/sighting';
import { ArrowLeft, Loader2, ImagePlus, MapPin, MapPinOff, Camera } from 'lucide-react';
import Link from 'next/link';
import { useGeolocationContext } from '@/context/GeolocationContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/components/FirebaseProvider';
import { handleFirestoreError, OperationType } from '@/lib/firestore-utils';

export default function ReportSighting() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [coatColor, setCoatColor] = useState('');
  const [pattern, setPattern] = useState('');
  const [size, setSize] = useState<CatSize | ''>('');
  const [status, setStatus] = useState<'stray' | 'owned' | ''>('');
  const [hasCollar, setHasCollar] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const { latitude, longitude, loading: locationLoading, error: locationError, retry: retryLocation } = useGeolocationContext();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorText("Você precisa estar logado para reportar um avistamento.");
      return;
    }
    if (!latitude || !longitude) {
      setErrorText("Aguardando localização.");
      return;
    }

    setSubmitting(true);
    setErrorText(null);
    
    try {
      let imageUrl;
      
      if (imageFile) {
        storage.maxUploadRetryTime = 15000; // 15 seconds
        const fileRef = ref(storage, `sightings/${Date.now()}_${imageFile.name}`);
        await uploadBytes(fileRef, imageFile);
        imageUrl = await getDownloadURL(fileRef);
      } else if (imagePreview) {
        imageUrl = imagePreview; // if it was somehow a string url instead of a file
      } else {
        throw new Error("Você deve fornecer uma imagem.");
      }

      const sightingData: any = {
        imageUrl: imageUrl, 
        latitude: latitude, 
        longitude: longitude, 
        createdBy: user.uid,
        createdAt: serverTimestamp()
      };

      if (coatColor) sightingData.coatColor = coatColor;
      if (pattern) sightingData.pattern = pattern;
      if (size) sightingData.size = size;
      if (status) sightingData.status = status;
      if (hasCollar !== null) sightingData.hasCollar = hasCollar;
      if (notes) sightingData.notes = notes;

      const docRef = await addDoc(collection(db, 'sightings'), sightingData);

      console.log(docRef)

      router.push('/');
    } catch (err: any) {
      setErrorText(err.message || 'Ocorreu um erro ao enviar. Verifique sua conexão e tente novamente.');
      try {
        handleFirestoreError(err, OperationType.CREATE, 'sightings');
      } catch (e) {
        // handleFirestoreError throws, we just want it to log
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 h-full w-full overflow-y-auto relative flex flex-col pb-20 font-sans text-slate-900 border-x border-slate-200 max-w-[1024px] mx-auto shadow-2xl">
      <div className="bg-white px-6 h-16 sticky top-0 z-30 shadow-sm border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Reportar Avistamento</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-8 max-w-xl mx-auto w-full mt-4">
        
        {/* Photo Upload */}
        <section className="flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Foto</label>
          <div className="w-full relative">
            {imagePreview ? (
              <div className="relative w-full aspect-square sm:aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                <label className="absolute bottom-4 right-4 bg-white/90 text-slate-800 px-4 py-2 rounded-lg backdrop-blur-sm text-sm font-semibold shadow-sm border border-slate-200 hover:bg-white cursor-pointer flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Tirar Nova Foto
                  <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-square sm:aspect-video bg-indigo-50/50 border border-indigo-100 border-dashed rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3 text-indigo-600">
                   <Camera className="w-6 h-6" />
                </div>
                <span className="text-indigo-600 font-semibold text-sm">Toque para tirar foto</span>
                <span className="text-slate-400 text-xs mt-1">A câmera abrirá automaticamente</span>
                <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </section>

        {/* Location Display */}
        <section className="flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Localização</label>
          <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between shadow-sm">
             {locationLoading ? (
               <span className="text-slate-500 text-sm font-semibold flex items-center gap-2">
                 <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                 Detectando localização...
               </span>
             ) : locationError ? (
               <div className="flex items-center justify-between w-full">
                 <span className="text-red-500 text-sm font-semibold flex items-center gap-2">
                   <MapPinOff className="w-4 h-4" />
                   Localização indisponível
                 </span>
                 <button onClick={retryLocation} type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 p-1">
                   Tentar novamente
                 </button>
               </div>
             ) : (
               <div className="flex items-center justify-between w-full">
                 <span className="text-slate-800 text-sm font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" /> 
                    Auto-detectado: {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
                 </span>
                 <button onClick={retryLocation} type="button" className="text-xs font-bold text-slate-400 hover:text-slate-600 p-1" title="Refresh Location">
                   Atualizar
                 </button>
               </div>
             )}
          </div>
        </section>

        {/* Details */}
        <section className="flex flex-col gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-2">
               <label className="text-xs font-bold text-slate-500">Cor</label>
               <input type="text" value={coatColor} onChange={(e) => setCoatColor(e.target.value)} placeholder="ex. Preto" className="border border-slate-200 rounded-lg p-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none bg-slate-50 placeholder-slate-400" />
            </div>
            <div className="flex flex-col gap-2">
               <label className="text-xs font-bold text-slate-500">Padrão</label>
               <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="ex. Tigrado" className="border border-slate-200 rounded-lg p-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none bg-slate-50 placeholder-slate-400" />
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500">Tamanho</label>
            <select value={size} onChange={(e) => setSize(e.target.value as CatSize | '')} className="border border-slate-200 rounded-lg p-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none bg-slate-50">
              <option value="">Desconhecido</option>
              <option value="kitten">Filhote</option>
              <option value="small">Pequeno</option>
              <option value="medium">Médio</option>
              <option value="large">Grande</option>
            </select>
          </div>

          <div className="mb-5 flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500">Status</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStatus('')} className={`flex-1 py-2 rounded text-sm font-bold transition-colors border ${status === '' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>Desconhecido</button>
              <button type="button" onClick={() => setStatus('stray')} className={`flex-1 py-2 rounded text-sm font-bold transition-colors border ${status === 'stray' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>Na Rua</button>
              <button type="button" onClick={() => setStatus('owned')} className={`flex-1 py-2 rounded text-sm font-bold transition-colors border ${status === 'owned' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>Tem dono</button>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <label className="text-xs font-bold text-slate-500 flex-1">Tem coleira?</label>
             <div className="flex gap-2">
                <button type="button" onClick={() => setHasCollar(true)} className={`px-4 py-1.5 rounded text-sm font-bold transition-colors border ${hasCollar === true ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>Sim</button>
                <button type="button" onClick={() => setHasCollar(false)} className={`px-4 py-1.5 rounded text-sm font-bold transition-colors border ${hasCollar === false ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>Não</button>
             </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500">Notas / Comportamento</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Amigável? Machucado? Fugiu?" className="border border-slate-200 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none resize-none bg-slate-50 placeholder-slate-400" />
          </div>
        </section>

        {/* Submit */}
        {errorText && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-sm font-semibold flex items-center gap-2">
            {errorText}
          </div>
        )}
        <button 
          type="submit" 
          disabled={submitting || !imageFile} 
          className={`font-bold py-3.5 rounded-lg w-full flex justify-center items-center gap-2 shadow-sm transition-all ${submitting || !imageFile ? 'bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-300' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white border border-indigo-500'}`}
        >
          {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Salvando...</> : 'Salvar Avistamento'}
        </button>
      </form>
    </div>
  );
}
