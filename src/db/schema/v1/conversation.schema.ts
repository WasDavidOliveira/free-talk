import { pgTable, serial, timestamp, integer, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { conversationParticipant } from '@/db/schema/v1/conversation-participant.schema';
import { message } from '@/db/schema/v1/message.schema';
import { user } from '@/db/schema/v1/user.schema';

export const conversation = pgTable('conversations', {
  id: serial('id').primaryKey(),
  createdBy: integer('created_by').notNull().references(() => user.id),
  title: varchar('title', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const conversationRelations = relations(conversation, ({ many, one }) => ({
  participants: many(conversationParticipant),
  messages: many(message),
  createdBy: one(user, {
    fields: [conversation.createdBy],
    references: [user.id],
  }),
}));