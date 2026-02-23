export interface Property {
  id?: number | undefined; // optional
  title: string;
  description: string;
  price: number;
  currency: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude: number;
  longitude: number;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  lot_size: number;
  year_built: number;
  features: string[];
  amenities: string[];
  listing_type: string;
  overview_image?: string;
  created_at?: Date;
  status?: string;
  agent?: number;
  is_favorite?: boolean;
  is_featured?: boolean;
}
