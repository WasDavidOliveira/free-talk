import { roles } from '@/db/schema/v1/role.schema';
import { user } from '@/db/schema/v1/user.schema';
import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey, timestamp } from 'drizzle-orm/pg-core';

export const userRoles = pgTable(
  'user_roles',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => user.id),
    roleId: integer('role_id')
      .notNull()
      .references(() => roles.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.roleId] }),
    };
  },
);

export const userRoleRelations = relations(userRoles, ({ one }) => ({
  user: one(user, {
    fields: [userRoles.userId],
    references: [user.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));
