import ConversationRepository from '@/repositories/v1/modules/conversation/conversation.repository';
import MessageRepository from '@/repositories/v1/modules/message/message.repository';
import { CreateMessageData } from '@/types/models/v1/message.types';
import { BadRequestError, ForbiddenError, NotFoundError } from '@/utils/core/app-error.utils';
import { PaginationInput } from '@/validations/v1/base/pagination.validations';
import { CreateMessageInput, MarkAsReadInput, UpdateMessageInput } from '@/validations/v1/modules/message.validations';

export class MessageService {
  async getMessagesByConversation(userId: number, conversationId: number, pagination: PaginationInput) {
    const hasAccess = await this.verifyConversationAccess(userId, conversationId);

    if (!hasAccess) {
      throw new ForbiddenError('Você não tem acesso a esta conversa');
    }

    const messages = await MessageRepository.getMessagesByConversation(conversationId, pagination);

    return messages;
  }

  async getMessageById(userId: number, conversationId: number, messageId: number) {
    const hasAccess = await this.verifyConversationAccess(userId, conversationId);

    if (!hasAccess) {
      throw new ForbiddenError('Você não tem acesso a esta conversa');
    }

    const message = await MessageRepository.findByIdAndConversation(messageId, conversationId);

    if (!message) {
      throw new NotFoundError('Mensagem não encontrada');
    }

    return message;
  }

  async createMessage(userId: number, conversationId: number, messageData: CreateMessageInput) {
    const hasAccess = await this.verifyConversationAccess(userId, conversationId);

    if (!hasAccess) {
      throw new ForbiddenError('Você não tem acesso a esta conversa');
    }

    const createData: CreateMessageData = {
      conversationId,
      senderId: userId,
      content: messageData.content as string,
      messageType: messageData.messageType as string | undefined,
    };

    const message = await MessageRepository.create(createData);

    if (!message) {
      throw new BadRequestError('Erro ao criar mensagem');
    }

    return message;
  }

  async updateMessage(userId: number, conversationId: number, messageId: number, messageData: UpdateMessageInput) {
    const hasAccess = await this.verifyConversationAccess(userId, conversationId);

    if (!hasAccess) {
      throw new ForbiddenError('Você não tem acesso a esta conversa');
    }

    const message = await MessageRepository.findByIdAndConversation(messageId, conversationId);

    if (!message) {
      throw new NotFoundError('Mensagem não encontrada');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenError('Você só pode editar suas próprias mensagens');
    }

    const updatedMessage = await MessageRepository.update(messageId, messageData);

    if (!updatedMessage) {
      throw new BadRequestError('Erro ao atualizar mensagem');
    }

    return updatedMessage;
  }

  async deleteMessage(userId: number, conversationId: number, messageId: number) {
    const hasAccess = await this.verifyConversationAccess(userId, conversationId);

    if (!hasAccess) {
      throw new ForbiddenError('Você não tem acesso a esta conversa');
    }

    const message = await MessageRepository.findByIdAndConversation(messageId, conversationId);

    if (!message) {
      throw new NotFoundError('Mensagem não encontrada');
    }

    const conversation = await ConversationRepository.findById(conversationId);
    const canDelete = message.senderId === userId || conversation?.createdBy === userId;

    if (!canDelete) {
      throw new ForbiddenError('Você não tem permissão para deletar esta mensagem');
    }

    await MessageRepository.delete(messageId);

    return true;
  }

  async markMessagesAsRead(userId: number, conversationId: number, markAsReadData: MarkAsReadInput) {
    const hasAccess = await this.verifyConversationAccess(userId, conversationId);

    if (!hasAccess) {
      throw new ForbiddenError('Você não tem acesso a esta conversa');
    }

    const { messageIds } = markAsReadData;

    for (const messageId of messageIds) {
      const message = await MessageRepository.findByIdAndConversation(messageId, conversationId);
      if (!message) {
        throw new BadRequestError(`Mensagem ${messageId} não encontrada nesta conversa`);
      }
    }

    await MessageRepository.markAsRead(messageIds);
    return true;
  }

  async getUnreadCount(userId: number, conversationId: number) {
    const hasAccess = await this.verifyConversationAccess(userId, conversationId);

    if (!hasAccess) {
      throw new ForbiddenError('Você não tem acesso a esta conversa');
    }

    const count = await MessageRepository.getUnreadMessagesCount(conversationId, userId);
    return { unreadCount: count };
  }

  protected async verifyConversationAccess(userId: number, conversationId: number): Promise<boolean> {
    const conversation = await ConversationRepository.findByIdAndUserId({
      id: conversationId,
      userId,
    });

    if (conversation) {
      return true;
    }

    const isParticipant = await ConversationRepository.isParticipant(conversationId, userId);

    return isParticipant;
  }
}

export default new MessageService();
