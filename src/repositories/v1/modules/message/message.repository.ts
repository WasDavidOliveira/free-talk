import { db } from '@/db/db.connection';
import { message } from '@/db/schema/v1/message.schema';
import { and, desc, eq, sql, asc, inArray } from 'drizzle-orm';
import { PaginationInput } from '@/validations/v1/base/pagination.validations';
import { PAGINATION_DEFAULT_VALUES } from '@/constants/pagination.constants';
import { 
  CreateMessageModel,
  MessageWithSender,
  UpdateMessageModel 
} from '@/types/models/v1/message.types';

export class MessageRepository {
  async getMessagesByConversation(conversationId: number, pagination: PaginationInput) {
    const { per_page, offset, page, order_direction } = pagination;

    const itemsPerPage = per_page || PAGINATION_DEFAULT_VALUES.LIMIT;
    const currentPage = page || PAGINATION_DEFAULT_VALUES.PAGE;
    const calculatedOffset = offset || (currentPage - 1) * itemsPerPage;
    const orderDirection = order_direction || 'desc';

    const orderFunction = orderDirection === 'asc' ? asc : desc;

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(message)
      .where(eq(message.conversationId, conversationId));

    const total = parseInt(totalResult[0]?.count?.toString() || '0');
    const totalPages = Math.ceil(total / itemsPerPage);

    const messages = await db.query.message.findMany({
      where: eq(message.conversationId, conversationId),
      with: {
        sender: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
        attachments: true,
      },
      limit: itemsPerPage,
      offset: calculatedOffset,
      orderBy: [orderFunction(message.createdAt)],
    });

    return {
      data: messages,
      pagination: {
        page: currentPage,
        per_page: itemsPerPage,
        total,
        total_pages: totalPages,
        offset: calculatedOffset,
        has_next_page: currentPage < totalPages,
        has_previous_page: currentPage > 1,
      },
    };
  }

  async findById(messageId: number): Promise<MessageWithSender | null> {
    const messageResult = await db.query.message.findFirst({
      where: eq(message.id, messageId),
      with: {
        sender: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
        attachments: true,
      },
    });

    return messageResult || null;
  }

  async findByIdAndConversation(messageId: number, conversationId: number): Promise<MessageWithSender | null> {
    const messageResult = await db.query.message.findFirst({
      where: and(
        eq(message.id, messageId),
        eq(message.conversationId, conversationId)
      ),
      with: {
        sender: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
        attachments: true,
      },
    });

    return messageResult || null;
  }

  async create(messageData: CreateMessageModel) {
    const [newMessage] = await db
      .insert(message)
      .values(messageData)
      .returning();

    return this.findById(newMessage.id);
  }

  async update(messageId: number, messageData: UpdateMessageModel) {
    const [updatedMessage] = await db
      .update(message)
      .set(messageData)
      .where(eq(message.id, messageId))
      .returning();

    return this.findById(updatedMessage.id);
  }

  async delete(messageId: number) {
    await db.delete(message).where(eq(message.id, messageId));
  }

  async markAsRead(messageIds: number[]) {
    await db
      .update(message)
      .set({ readAt: new Date() })
      .where(inArray(message.id, messageIds));
  }

  async getUnreadMessagesCount(conversationId: number, userId: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(message)
      .where(
        and(
          eq(message.conversationId, conversationId),
          eq(message.senderId, userId),
          sql`${message.readAt} IS NULL`
        )
      );

    return parseInt(result[0]?.count?.toString() || '0');
  }

  async getLastMessage(conversationId: number): Promise<MessageWithSender | null> {
    const lastMessage = await db.query.message.findFirst({
      where: eq(message.conversationId, conversationId),
      with: {
        sender: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [desc(message.createdAt)],
    });

    return lastMessage || null;
  }

  async deleteByConversation(conversationId: number) {
    await db.delete(message).where(eq(message.conversationId, conversationId));
  }

  async countByConversation(conversationId: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(message)
      .where(eq(message.conversationId, conversationId));

    return parseInt(result[0]?.count?.toString() || '0');
  }
}

export default new MessageRepository();
