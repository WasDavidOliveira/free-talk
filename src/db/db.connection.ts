import { user, userRelations } from '@/db/schema/v1/user.schema';
import { roles, roleRelations } from '@/db/schema/v1/role.schema';
import { permissions, permissionRelations } from '@/db/schema/v1/permission.schema';
import { rolePermissions, rolePermissionRelations } from '@/db/schema/v1/role-permission.schema';
import { userRoles, userRoleRelations } from '@/db/schema/v1/user-role.schema';
import appConfig from '@/configs/app.config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { conversation, conversationRelations } from '@/db/schema/v1/conversation.schema';
import { conversationParticipant, conversationParticipantRelations } from '@/db/schema/v1/conversation-participant.schema';
import { message, messageRelations } from '@/db/schema/v1/message.schema';
import { messageAttachment, messageAttachmentRelations } from '@/db/schema/v1/message-attachment.schema';

const pool = new Pool({
  connectionString: appConfig.databaseUrl,
  ssl: false,
});

export const db = drizzle(pool, {
  schema: {
    user,
    userRelations,
    roles,
    roleRelations,
    permissions,
    permissionRelations,
    rolePermissions,
    rolePermissionRelations,
    userRoles,
    userRoleRelations,
    conversation,
    conversationRelations,
    conversationParticipant,
    conversationParticipantRelations,
    message,
    messageRelations,
    messageAttachment,
    messageAttachmentRelations,
  },
});
