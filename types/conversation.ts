export type Conversation = {
  id?: number;
  user_id: number;
  agent_id?: number | null;
  property_id?: number | null;
  type: string;
  user_first_name?: string | null;
  user_last_name?: string | null;
  agent_first_name?: string | null;
  agent_last_name?: string | null;
  property_title?: string | null;
};
