import React from 'react';
import Link from 'next/link';
import { Sighting } from '@/types/sighting';
import { formatTimeAgo } from '@/lib/utils';
import { useAddress } from '@/hooks/useAddress';
import { MapPin } from 'lucide-react';

interface SightingListItemProps {
  sighting: Sighting;
}

export function SightingListItem({ sighting }: SightingListItemProps) {
  const { address, loading } = useAddress(sighting.latitude, sighting.longitude);

  const translateSightingStatus = (status: string) => {
    return status == "owned" ? "Tem Dono" : "Na rua"
  }

  return (
    <Link href={`/sightings/${sighting.id}`} className="p-4 block transition-colors hover:bg-slate-50">
      <div className="flex items-start space-x-3">
        <div className="w-20 h-20 bg-slate-200 rounded-lg flex-shrink-0 overflow-hidden relative border border-white mt-1">
           <img src={sighting.imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              {sighting.status && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${sighting.status === 'owned' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {translateSightingStatus(sighting.status)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400" suppressHydrationWarning>
               {sighting.createdAt ? formatTimeAgo(sighting.createdAt) : ''}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1.5 truncate">{sighting.coatColor || sighting.pattern || 'Gato Avistado'}</h3>
          
          <div className="flex items-center text-xs text-slate-500 mt-1">
             <MapPin className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
             <span className="truncate">{loading ? 'Carregando localização...' : (address || 'Localização Desconhecida')}</span>
          </div>
          
          <p className="text-xs text-slate-500 line-clamp-1 mt-1.5">{sighting.notes}</p>
        </div>
      </div>
    </Link>
  );
}
