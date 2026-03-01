export interface TicketMessage {
  id?: number;
  ticket_id: number;
  sender_id: number;
  message: string;
  created_at?: string;
}
