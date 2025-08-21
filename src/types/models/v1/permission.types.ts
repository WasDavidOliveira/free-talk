import { PermissionAction } from '@/constants/permission.constants';
import { permissions } from '@/db/schema/v1/permission.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type PermissionModel = InferSelectModel<typeof permissions>;
export type CreatePermissionModel = InferInsertModel<typeof permissions>;

export type PermissionCheck = {
  name: string;
  action: PermissionAction;
};
