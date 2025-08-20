import ConversationRepository from '@/repositories/v1/modules/conversation/conversation.repository';
import { PaginationInput } from '@/validations/v1/base/pagination.validations';
import { NotFoundError } from '@/utils/core/app-error.utils';
import {
  CreateConversationInput,
  UpdateConversationInput,
} from '@/validations/v1/modules/conversation.validations';

export class ConversationService {
  async index(userId: number, pagination: PaginationInput) {
    const conversations = await ConversationRepository.index(
      userId,
      pagination
    );

    return conversations;
  }

  async show(userId: number, conversationId: number) {
    const conversation = await ConversationRepository.findByIdAndUserId({
      id: conversationId,
      userId,
    });

    if (!conversation) {
      throw new NotFoundError('Conversa não encontrada');
    }

    return conversation;
  }

  async create(userId: number, conversationData: CreateConversationInput) {
    const conversation = await ConversationRepository.create({
      ...conversationData,
      createdBy: userId,
    });

    return conversation;
  }

  async update(
    userId: number,
    conversationId: number,
    conversationData: UpdateConversationInput
  ) {
    const conversation = await ConversationRepository.findByIdAndUserId({
      id: conversationId,
      userId,
    });

    if (!conversation) {
      throw new NotFoundError('Conversa não encontrada');
    }

    const updatedConversation = await ConversationRepository.update(
      userId,
      conversationId,
      conversationData
    );

    return updatedConversation;
  }

  async delete(userId: number, conversationId: number) {
    const conversation = await ConversationRepository.findByIdAndUserId({
      id: conversationId,
      userId,
    });

    if (!conversation) {
      throw new NotFoundError('Conversa não encontrada');
    }

    await ConversationRepository.delete(conversationId);

    return true;
  }
}

export default new ConversationService();
