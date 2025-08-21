import { relations } from 'drizzle-orm';
import { bigint, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { message } from './message.schema';

export const messageAttachment = pgTable('message_attachments', {
  id: serial('id').primaryKey(),
  messageId: integer('message_id')
    .notNull()
    .references(() => message.id),
  fileUrl: varchar('file_url', { length: 500 }).notNull(),
  fileType: varchar('file_type', { length: 100 }).notNull(),
  fileSize: bigint('file_size', { mode: 'number' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messageAttachmentRelations = relations(messageAttachment, ({ one }) => ({
  message: one(message, {
    fields: [messageAttachment.messageId],
    references: [message.id],
  }),
}));
