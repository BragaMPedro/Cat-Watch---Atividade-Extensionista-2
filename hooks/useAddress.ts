import { useState, useEffect } from 'react';

const addressCache = new Map<string, Promise<string>>();

export function useAddress(latitude?: number, longitude?: number) {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (latitude === undefined || longitude === undefined) {
      const timer = setTimeout(() => {
        if (mounted) {
          setAddress(null);
          setLoading(false);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
    const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;

    const fetchAddress = async () => {
      setLoading(true);
      try {
        let addressPromise = addressCache.get(key);
        
        if (!addressPromise) {
          addressPromise = (async () => {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`);
            if (!res.ok) throw new Error('Falha ao buscar endereço');
            const data = await res.json();
            
            let parts = [];
            if (data.locality) parts.push(data.locality);
            if (data.city && data.city !== data.locality) parts.push(data.city);
            if (parts.length === 0 && data.principalSubdivision) parts.push(data.principalSubdivision);
            
            return parts.length > 0 ? parts.join(', ') : 'Localização Desconhecida';
          })();
          
          addressCache.set(key, addressPromise);
        }
        
        const addressString = await addressPromise;
        
        if (mounted) {
          setAddress(addressString);
        }
      } catch (e) {
        if (mounted) {
          setAddress('Localização Desconhecida');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAddress();

    return () => {
      mounted = false;
    };
  }, [latitude, longitude]);

  return { address, loading };
}
