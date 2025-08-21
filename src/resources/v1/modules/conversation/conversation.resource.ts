import userRepository from '@/repositories/v1/modules/auth/user.repository';
import { UserResource } from '@/resources/v1/modules/user/user.resources';
import { ConversationModel } from '@/types/models/v1/conversation.types';
import { resolveRelation } from '@/utils/db/relation-resolver.utils';

export default class ConversationResource {
  static async toResponse(item: ConversationModel) {
    const createdBy = await resolveRelation(item.createdBy, userRepository, UserResource.toResponseBasic);

    return {
      id: item.id,
      title: item.title,
      createdBy,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  static collectionToResponse(items: ConversationModel[]) {
    return items.map((i) => this.toResponse(i));
  }
}
