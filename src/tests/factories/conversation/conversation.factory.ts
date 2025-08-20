import { faker } from '@faker-js/faker';
import ConversationRepository from '@/repositories/v1/modules/conversation/conversation.repository';
import {
  ConversationModel,
  CreateConversationModel,
} from '@/types/models/v1/conversation.types';
import { UserFactory } from '@/tests/factories/auth/user.factory';

export class ConversationBuilder {
  private data: Partial<CreateConversationModel> = {};

  withTitle(title: string): ConversationBuilder {
    this.data.title = title;
    return this;
  }

  withRandomTitle(): ConversationBuilder {
    this.data.title = faker.lorem.sentence();
    return this;
  }

  withCreatedBy(userId: number): ConversationBuilder {
    this.data.createdBy = userId;
    return this;
  }

  withRandomUser(): ConversationBuilder {
    this.data.createdBy = faker.number.int({ min: 1, max: 100 });
    return this;
  }

  withOverrides(
    overrides: Partial<CreateConversationModel>
  ): ConversationBuilder {
    this.data = { ...this.data, ...overrides };
    return this;
  }

  build(): CreateConversationModel {
    return {
      title: this.data.title || faker.lorem.sentence(),
      createdBy: this.data.createdBy || 1,
    };
  }

  async create(): Promise<ConversationModel> {
    const conversationData = this.build();
    const conversation = await ConversationRepository.create(conversationData);

    const conversationWithRelations = await ConversationRepository.findById(
      conversation.id
    );

    if (!conversationWithRelations) {
      throw new Error('Conversa não encontrada após criação');
    }

    return conversationWithRelations;
  }

  async createWithUser(): Promise<ConversationModel> {
    const { user } = await UserFactory.createUser();
    this.data.createdBy = user.id;

    return this.create();
  }

  async createMany(count: number): Promise<ConversationModel[]> {
    const conversations: ConversationModel[] = [];

    for (let i = 0; i < count; i++) {
      const conversation = await this.create();
      conversations.push(conversation);
    }

    return conversations;
  }
}

export class ConversationFactory {
  static builder(): ConversationBuilder {
    return new ConversationBuilder();
  }

  static makeConversationData(
    overrides: Partial<CreateConversationModel> = {}
  ): CreateConversationModel {
    return new ConversationBuilder().withOverrides(overrides).build();
  }

  static async createConversation(
    overrides: Partial<CreateConversationModel> = {}
  ): Promise<ConversationModel> {
    return new ConversationBuilder().withOverrides(overrides).create();
  }

  static async createConversationWithUser(
    overrides: Partial<CreateConversationModel> = {}
  ): Promise<ConversationModel> {
    return new ConversationBuilder().withOverrides(overrides).createWithUser();
  }

  static async createManyConversations(
    count: number,
    overrides: Partial<CreateConversationModel> = {}
  ): Promise<ConversationModel[]> {
    return new ConversationBuilder().withOverrides(overrides).createMany(count);
  }
}
