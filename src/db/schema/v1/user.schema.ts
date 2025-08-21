import { conversationParticipant } from '@/db/schema/v1/conversation-participant.schema';
import { message } from '@/db/schema/v1/message.schema';
import { userRoles } from '@/db/schema/v1/user-role.schema';
import { relations } from 'drizzle-orm';
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  userRoles: many(userRoles),
  conversationParticipants: many(conversationParticipant),
  messages: many(message),
}));
