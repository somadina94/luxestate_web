export type Message = {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  timestamp: string;
  is_read: boolean;
};

export type NewMessagePayload = {
  type: "new_message";
  conversation_id: number;
  message: Message;
};

export type DeliveredPayload = {
  type: "delivered";
  conversation_id: number;
  message_id: number;
  to: number;
};

export type ChatWSPayload = NewMessagePayload | DeliveredPayload;
