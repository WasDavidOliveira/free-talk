import { db } from '@/db/db.connection';
import { user } from '@/db/schema/v1/user.schema';
import { CreateUserModel, UpdateUserModel, UserModel } from '@/types/models/v1/auth.types';
import { ConflictError } from '@/utils/core/app-error.utils';
import { eq } from 'drizzle-orm';

class UserRepository {
  async findById(id: number): Promise<UserModel | null> {
    const users = await db.select().from(user).where(eq(user.id, id)).limit(1);

    return users[0] || null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const users = await db.select().from(user).where(eq(user.email, email)).limit(1);

    return users[0] || null;
  }

  async create(userData: CreateUserModel): Promise<UserModel> {
    try {
      const [newUser] = await db.insert(user).values(userData).returning();

      return newUser;
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error && 'detail' in error) {
        const dbError = error as { code: string; detail: string };

        if (dbError.code === '23505') {
          if (dbError.detail.includes('email')) {
            throw new ConflictError('Email já está em uso');
          }

          throw new ConflictError('Recurso já existe');
        }
      }

      throw error;
    }
  }

  async update(id: number, userData: UpdateUserModel): Promise<UserModel> {
    const [updatedUser] = await db
      .update(user)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(user.id, id))
      .returning();

    return updatedUser;
  }
}

export default new UserRepository();
