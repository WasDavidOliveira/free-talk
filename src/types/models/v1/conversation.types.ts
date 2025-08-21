import { conversation } from '@/db/schema/v1/conversation.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type ConversationModel = InferSelectModel<typeof conversation>;
export type CreateConversationModel = InferInsertModel<typeof conversation>;
export type UpdateConversationModel = Partial<ConversationModel>;
