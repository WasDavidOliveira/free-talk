import { UserResource } from '@/resources/v1/modules/user/user.resources';
import { UserModel } from '@/types/models/v1/auth.types';
import { ConversationModel } from '@/types/models/v1/conversation.types';

export class ConversationResource {
  static toResponse(item: ConversationModel) {
    return {
      id: item.id,
      title: item.title,
      createdBy: item.createdBy ? UserResource.toResponseBasic(item.createdBy as unknown as UserModel) : null,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  static collectionToResponse(items: ConversationModel[]) {
    return items.map((i) => this.toResponse(i));
  }
}


