import { MessageType } from '@/enums/v1/modules/chat/message-types.enum';
import { MessageRepository } from '@/repositories/v1/modules/message/message.repository';
import { UserFactory } from '@/tests/factories/auth/user.factory';
import { ConversationFactory } from '@/tests/factories/conversation/conversation.factory';
import { UserModel } from '@/types/models/v1/auth.types';
import { ConversationModel } from '@/types/models/v1/conversation.types';
import { CreateMessageModel, MessageWithSender } from '@/types/models/v1/message.types';
import { faker } from '@faker-js/faker';

export class MessageBuilder {
  private data: Partial<CreateMessageModel> = {};

  withContent(content: string): MessageBuilder {
    this.data.content = content;
    return this;
  }

  withRandomContent(): MessageBuilder {
    this.data.content = faker.lorem.paragraph();
    return this;
  }

  withConversationId(conversationId: number): MessageBuilder {
    this.data.conversationId = conversationId;
    return this;
  }

  withSenderId(senderId: number): MessageBuilder {
    this.data.senderId = senderId;
    return this;
  }

  withMessageType(messageType: string): MessageBuilder {
    this.data.messageType = messageType;
    return this;
  }

  withRandomMessageType(): MessageBuilder {
    const types = [MessageType.TEXT, MessageType.FILE, MessageType.MIXED];
    this.data.messageType = faker.helpers.arrayElement(types);
    return this;
  }

  withOverrides(overrides: Partial<CreateMessageModel>): MessageBuilder {
    this.data = { ...this.data, ...overrides };
    return this;
  }

  build(): CreateMessageModel {
    return {
      conversationId: this.data.conversationId || 1,
      senderId: this.data.senderId || 1,
      content: this.data.content || faker.lorem.paragraph(),
      messageType: this.data.messageType || MessageType.TEXT,
    };
  }

  async create(): Promise<MessageWithSender> {
    const messageData = this.build();
    const messageRepository = new MessageRepository();
    const message = await messageRepository.create(messageData);

    if (!message) {
      throw new Error('Mensagem não foi criada');
    }

    return message;
  }

  async createWithUserAndConversation(): Promise<{
    message: MessageWithSender;
    user: UserModel;
    conversation: ConversationModel;
  }> {
    const { user } = await UserFactory.createUser();
    const conversation = await ConversationFactory.createConversation({
      createdBy: user.id,
    });

    this.data.conversationId = conversation.id;
    this.data.senderId = user.id;

    const message = await this.create();

    return {
      message,
      user,
      conversation,
    };
  }

  async createMany(count: number): Promise<MessageWithSender[]> {
    const messages: MessageWithSender[] = [];

    for (let i = 0; i < count; i++) {
      const message = await this.create();
      messages.push(message);
    }

    return messages;
  }
}

export class MessageFactory {
  static builder(): MessageBuilder {
    return new MessageBuilder();
  }

  static makeMessageData(overrides: Partial<CreateMessageModel> = {}): CreateMessageModel {
    return new MessageBuilder().withOverrides(overrides).build();
  }

  static async createMessage(overrides: Partial<CreateMessageModel> = {}): Promise<MessageWithSender> {
    return new MessageBuilder().withOverrides(overrides).create();
  }

  static async createMessageWithUserAndConversation(overrides: Partial<CreateMessageModel> = {}): Promise<{
    message: MessageWithSender;
    user: UserModel;
    conversation: ConversationModel;
  }> {
    return new MessageBuilder().withOverrides(overrides).createWithUserAndConversation();
  }

  static async createManyMessages(
    count: number,
    overrides: Partial<CreateMessageModel> = {},
  ): Promise<MessageWithSender[]> {
    return new MessageBuilder().withOverrides(overrides).createMany(count);
  }

  static async createMessagesForConversation(
    conversationId: number,
    senderId: number,
    count: number = 5,
  ): Promise<MessageWithSender[]> {
    const messages: MessageWithSender[] = [];

    for (let i = 0; i < count; i++) {
      const message = await MessageFactory.createMessage({
        conversationId,
        senderId,
        content: `Mensagem ${i + 1}: ${faker.lorem.sentence()}`,
      });
      messages.push(message);
    }

    return messages;
  }

  static async createConversationWithMessages(
    userId: number,
    messageCount: number = 5,
  ): Promise<{
    conversation: ConversationModel;
    messages: MessageWithSender[];
  }> {
    const conversation = await ConversationFactory.createConversation({
      createdBy: userId,
    });

    const messages = await MessageFactory.createMessagesForConversation(conversation.id, userId, messageCount);

    return {
      conversation,
      messages,
    };
  }

  static async createConversationWithMultipleUsers(
    userCount: number = 3,
    messagesPerUser: number = 2,
  ): Promise<{
    conversation: ConversationModel;
    users: UserModel[];
    messages: MessageWithSender[];
  }> {
    const users: UserModel[] = [];
    for (let i = 0; i < userCount; i++) {
      const { user } = await UserFactory.createUser();
      users.push(user);
    }

    const conversation = await ConversationFactory.createConversation({
      createdBy: users[0].id,
    });

    await ConversationFactory.addParticipantsToConversation(conversation.id, users.slice(1));

    const messages: MessageWithSender[] = [];
    for (const user of users) {
      const userMessages = await MessageFactory.createMessagesForConversation(
        conversation.id,
        user.id,
        messagesPerUser,
      );
      messages.push(...userMessages);
    }

    return {
      conversation,
      users,
      messages,
    };
  }
}
