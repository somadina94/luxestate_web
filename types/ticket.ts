import { TicketMessage } from "./ticket-message";

type TicketUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

export interface Ticket {
  id?: number;
  user_id?: number;
  title: string;
  user?: TicketUser;
  messages?: TicketMessage[];
  status?: string;
  created_at?: string;
}
