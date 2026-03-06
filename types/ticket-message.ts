export interface TicketMessage {
  id?: number;
  ticket_id: number;
  sender_id: number;
  sender?: {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
  };
  message: string;
  created_at?: string;
}
