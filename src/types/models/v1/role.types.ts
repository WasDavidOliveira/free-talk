import { roles } from '@/db/schema/v1/role.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type RoleModel = InferSelectModel<typeof roles>;
export type CreateRoleModel = InferInsertModel<typeof roles>;
