import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Sighting } from '../types/sighting';
import { handleFirestoreError, OperationType } from '../lib/firestore-utils';

export function useSightings() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'sightings'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Sighting[];
        setSightings(results);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'sightings');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { sightings, loading };
}
