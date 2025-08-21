import { MessageWithAttachments, MessageWithSender } from '@/types/models/v1/message.types';

export class MessageResource {
  static async toResponse(message: MessageWithSender | MessageWithAttachments) {
    return {
      id: message.id,
      conversationId: message.conversationId,
      content: message.content,
      messageType: message.messageType,
      createdAt: message.createdAt,
      readAt: message.readAt,
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        email: message.sender.email,
      },
      attachments: 'attachments' in message ? message.attachments : undefined,
    };
  }

  static async toResponseArray(messages: (MessageWithSender | MessageWithAttachments)[]) {
    return Promise.all(messages.map((message) => this.toResponse(message)));
  }
}

export default MessageResource;
