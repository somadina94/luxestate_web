export interface Notification {
  id?: number;
  title: string;
  body: string;
  payload: string;
  is_read: boolean;
  created_at: Date;
}
