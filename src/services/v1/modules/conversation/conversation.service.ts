import ConversationRepository from '@/repositories/v1/modules/conversation/conversation.repository';
import { PaginationInput } from '@/validations/v1/base/pagination.validations';
import { BadRequestError, NotFoundError } from '@/utils/core/app-error.utils';
import {
  CreateConversationInput,
  UpdateConversationInput,
  AddParticipantsInput,
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

  async addParticipants(userId: number, conversationId: number, participantsData: AddParticipantsInput) {
    const conversation = await ConversationRepository.findByIdAndUserId({
      id: conversationId,
      userId,
    });

    if (!conversation) {
      throw new NotFoundError('Conversa não encontrada');
    }

    const existingParticipants = await ConversationRepository.getExistingParticipants(conversationId, participantsData.userIds);

    if (existingParticipants.length > 0) {
      throw new BadRequestError('Alguns participantes já existem na conversa. IDs: ' + existingParticipants.join(', '));
    }

    const participants = await ConversationRepository.addParticipants(conversationId, participantsData.userIds);

    return participants;
  }

  async removeParticipant(userId: number, conversationId: number, participantUserId: number) {
    const conversation = await ConversationRepository.findByIdAndUserId({
      id: conversationId,
      userId,
    });

    if (!conversation) {
      throw new NotFoundError('Conversa não encontrada');
    }

    const isParticipant = await ConversationRepository.isParticipant(
      conversationId,
      participantUserId
    );

    if (!isParticipant) {
      throw new NotFoundError('Usuário não é participante desta conversa');
    }

    await ConversationRepository.removeParticipant(conversationId, participantUserId);

    return true;
  }

  async getParticipants(userId: number, conversationId: number) {
    const conversation = await ConversationRepository.findByIdAndUserId({
      id: conversationId,
      userId,
    });

    if (!conversation) {
      throw new NotFoundError('Conversa não encontrada');
    }

    const participants = await ConversationRepository.getParticipants(conversationId);
    
    return participants;
  }
}

export default new ConversationService();
