import { user } from '@/db/schema/v1/user.schema';
import { roles } from '@/db/schema/v1/role.schema';
import { permissions } from '@/db/schema/v1/permission.schema';
import { rolePermissions } from '@/db/schema/v1/role-permission.schema';
import { userRoles } from '@/db/schema/v1/user-role.schema';
import { conversation } from '@/db/schema/v1/conversation.schema';
import { conversationParticipant } from '@/db/schema/v1/conversation-participant.schema';
import { message } from '@/db/schema/v1/message.schema';
import { messageAttachment } from '@/db/schema/v1/message-attachment.schema';
import appConfig from '@/configs/app.config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: appConfig.databaseUrl,
  ssl: false,
});

export const db = drizzle(pool, {
  schema: {
    user,
    roles,
    permissions,
    rolePermissions,
    userRoles,
    conversation,
    conversationParticipant,
    message,
    messageAttachment,
  },
});
