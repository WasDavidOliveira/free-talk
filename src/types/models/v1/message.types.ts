import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { message } from '@/db/schema/v1/message.schema';

export type MessageModel = InferSelectModel<typeof message>;
export type CreateMessageModel = InferInsertModel<typeof message>;
export type UpdateMessageModel = Partial<Omit<MessageModel, 'id' | 'createdAt' | 'conversationId' | 'senderId'>>;

export interface MessageWithSender {
  id: number;
  conversationId: number;
  senderId: number;
  content: string | null;
  messageType: string;
  createdAt: Date;
  readAt: Date | null;
  sender: {
    id: number;
    name: string;
    email: string;
  };
}

export interface MessageWithAttachments extends MessageWithSender {
  attachments: {
    id: number;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }[];
}

export interface CreateMessageData {
  conversationId: number;
  senderId: number;
  content: string;
  messageType?: string;
}
