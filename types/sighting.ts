export type CatSize = 'kitten' | 'small' | 'medium' | 'large';
export type CatStatus = 'stray' | 'owned';

export interface Sighting {
  id: string; // Document ID
  imageUrl: string;
  latitude: number;
  longitude: number;
  notes?: string;
  coatColor?: string;
  pattern?: string;
  size?: CatSize;
  status?: CatStatus;
  hasCollar?: boolean;
  createdBy?: string;
  createdAt?: string; // ISO date-time string
}
