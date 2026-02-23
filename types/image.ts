export interface PropertyImage {
  id: number;
  property_id: number;
  is_primary: boolean;
  alt_text: string;
  file_url: string;
  file_key: string;
  order_index: number;
  createdAt: Date;
}
