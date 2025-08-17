import { pgTable, serial, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { conversation } from './conversation.schema';
import { user } from './user.schema';

export const conversationParticipant = pgTable('conversation_participants', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').notNull().references(() => conversation.id),
  userId: integer('user_id').notNull().references(() => user.id),
});

export const conversationParticipantRelations = relations(conversationParticipant, ({ one }) => ({
  conversation: one(conversation, {
    fields: [conversationParticipant.conversationId],
    references: [conversation.id],
  }),
  user: one(user, {
    fields: [conversationParticipant.userId],
    references: [user.id],
  }),
}));
