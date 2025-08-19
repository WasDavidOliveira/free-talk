import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { conversation } from '@/db/schema/v1/conversation.schema';

export type ConversationModel = InferSelectModel<typeof conversation>;
export type CreateConversationModel = InferInsertModel<typeof conversation>;
export type UpdateConversationModel = Partial<ConversationModel>;