import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { conversationParticipant } from '@/db/schema/v1/conversation-participant.schema';

export type ConversationParticipantModel = InferSelectModel<typeof conversationParticipant>;
export type CreateConversationParticipantModel = InferInsertModel<typeof conversationParticipant>;

export interface ConversationParticipantWithUser {
  id: number;
  conversationId: number;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ParticipantSummary {
  userId: number;
  name: string;
  email: string;
}
