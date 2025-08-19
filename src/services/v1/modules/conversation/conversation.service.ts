import ConversationRepository from '@/repositories/v1/modules/conversation/conversation.repository';
import { PaginationInput } from '@/validations/v1/base/pagination.validations';

export class ConversationService {
  async index(userId: number, pagination: PaginationInput) {
    const conversations = await ConversationRepository.index(userId, pagination);

    return conversations;
  }
}

export default new ConversationService();
