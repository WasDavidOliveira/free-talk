import { messageAttachment } from '@/db/schema/v1/message-attachment.schema';
import { MessageType } from '@/enums/v1/modules/chat/message-types.enum';
import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { conversation } from './conversation.schema';
import { user } from './user.schema';

export const message = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id')
    .notNull()
    .references(() => conversation.id),
  senderId: integer('sender_id')
    .notNull()
    .references(() => user.id),
  content: text('content'),
  messageType: varchar('message_type', { length: 20 }).notNull().default(MessageType.TEXT),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  readAt: timestamp('read_at'),
});

export const messageRelations = relations(message, ({ one, many }) => ({
  conversation: one(conversation, {
    fields: [message.conversationId],
    references: [conversation.id],
  }),
  sender: one(user, {
    fields: [message.senderId],
    references: [user.id],
  }),
  attachments: many(messageAttachment),
}));
