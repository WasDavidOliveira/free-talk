import appConfig from '@/configs/app.config';
import {
  conversationParticipant,
  conversationParticipantRelations,
} from '@/db/schema/v1/conversation-participant.schema';
import { conversation, conversationRelations } from '@/db/schema/v1/conversation.schema';
import { messageAttachment, messageAttachmentRelations } from '@/db/schema/v1/message-attachment.schema';
import { message, messageRelations } from '@/db/schema/v1/message.schema';
import { permissionRelations, permissions } from '@/db/schema/v1/permission.schema';
import { rolePermissionRelations, rolePermissions } from '@/db/schema/v1/role-permission.schema';
import { roleRelations, roles } from '@/db/schema/v1/role.schema';
import { userRoleRelations, userRoles } from '@/db/schema/v1/user-role.schema';
import { user, userRelations } from '@/db/schema/v1/user.schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

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
