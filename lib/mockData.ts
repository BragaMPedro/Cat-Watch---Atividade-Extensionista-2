import { Sighting } from '@/types/sighting';

export const mockSightings: Sighting[] = [
  {
    id: "1",
    latitude: 37.76,
    longitude: -122.48,
    createdAt: "2026-05-08T15:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600",
    coatColor: "Ginger Tabby",
    size: "medium",
    status: "owned",
    notes: "Blue collar, friendly but shy. Last seen near 19th Ave playground.",
    hasCollar: true
  },
  {
    id: "2",
    latitude: 37.77,
    longitude: -122.47,
    createdAt: "2026-05-12T08:15:00Z",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600",
    coatColor: "Large White Fluff",
    size: "large",
    status: "stray",
    notes: "No collar visible. Running towards Kirkham St.",
    hasCollar: false
  },
  {
    id: "3",
    latitude: 37.75,
    longitude: -122.49,
    createdAt: "2026-01-08T13:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=600",
    coatColor: "Calico Mix",
    size: "medium",
    notes: "Chilling on a porch near Golden Gate Park entrance."
  }
];
