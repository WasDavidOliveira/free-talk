import appConfig from '@/configs/app.config';
import UserRepository from '@/repositories/v1/modules/auth/user.repository';
import { NotFoundError, UnauthorizedError, BadRequestError } from '@/utils/core/app-error.utils';
import { LoginInput, RegisterInput } from '@/validations/v1/modules/auth.validations';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  async login(data: LoginInput) {
    const user = await UserRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    // @ts-expect-error
    const token = jwt.sign({ id: user.id }, appConfig.jwtSecret, {
      expiresIn: appConfig.jwtExpiration,
    });

    return {
      token,
    };
  }

  async register(data: RegisterInput) {
    const userData: RegisterInput = data;

    const passwordHash = await bcrypt.hash(userData.password, 10);

    const user = await UserRepository.create({
      ...userData,
      password: passwordHash,
    });

    return user;
  }

  async me(userId: number) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    return user;
  }

  async resetPassword(email: string) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const newPassword = this.generateRandomPassword();
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await UserRepository.update(user.id, { password: passwordHash });

    return {
      user,
      newPassword,
    };
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedError('Senha atual incorreta');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await UserRepository.update(userId, { password: newPasswordHash });

    return user;
  }

  async updateUser(userId: number, updateData: {
    name?: string;
    currentPassword?: string;
    newPassword?: string;
  }) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const updateFields: { name?: string; password?: string } = {};

    if (updateData.name) {
      updateFields.name = updateData.name;
    }

    if (updateData.currentPassword && updateData.newPassword) {
      const isCurrentPasswordValid = await bcrypt.compare(updateData.currentPassword, user.password);

      if (!isCurrentPasswordValid) {
        throw new UnauthorizedError('Senha atual incorreta');
      }

      const newPasswordHash = await bcrypt.hash(updateData.newPassword, 10);
      updateFields.password = newPasswordHash;
    }

    if (Object.keys(updateFields).length === 0) {
      throw new BadRequestError('Nenhum campo válido fornecido para atualização');
    }

    const updatedUser = await UserRepository.update(userId, updateFields);

    return updatedUser;
  }

  protected generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }
}

export default new AuthService();
