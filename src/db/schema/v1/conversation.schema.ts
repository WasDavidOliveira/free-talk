import { pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { conversationParticipant } from '@/db/schema/v1/conversation-participant.schema';
import { message } from '@/db/schema/v1/message.schema';

export const conversation = pgTable('conversations', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const conversationRelations = relations(conversation, ({ many }) => ({
  participants: many(conversationParticipant),
  messages: many(message),
}));