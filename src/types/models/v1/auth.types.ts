import { user } from '@/db/schema/v1/user.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type UserModel = InferSelectModel<typeof user>;
export type CreateUserModel = InferInsertModel<typeof user>;
