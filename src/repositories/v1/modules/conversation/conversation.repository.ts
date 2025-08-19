import { db } from '@/db/db.connection';
import { conversation } from '@/db/schema/v1/conversation.schema';
import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { PaginationInput } from '@/validations/v1/base/pagination.validations';
import { CreateConversationModel } from '@/types/models/v1/conversation.types';
import { PAGINATION_DEFAULT_VALUES } from '@/constants/pagination.constants';

class ConversationRepository {
  async index(userId: number, pagination: PaginationInput) {
    const { per_page, offset, search, order_by, page } = pagination;

    const itemsPerPage = per_page || PAGINATION_DEFAULT_VALUES.LIMIT;
    const currentPage = page || PAGINATION_DEFAULT_VALUES.PAGE;
    const calculatedOffset = offset || (currentPage - 1) * itemsPerPage;
    const searchTerm = search || '';
    const orderBy = order_by || 'created_at';

    const hasSearch = searchTerm.trim().length > 0;

    const whereClause = hasSearch
      ? and(eq(conversation.createdBy, userId), ilike(conversation.title, `%${searchTerm}%`))
      : eq(conversation.createdBy, userId);

    const orderField = orderBy === 'title' ? conversation.title : conversation.createdAt;

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(conversation)
      .where(whereClause);

    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(total / itemsPerPage);

    const conversations = await db.query.conversation.findMany({
      where: whereClause,
      with: {
        createdBy: true,
      },
      limit: itemsPerPage,
      offset: calculatedOffset,
      orderBy: [desc(orderField)],
    });

    return {
      data: conversations,
      pagination: {
        total,
        page: currentPage,
        per_page: itemsPerPage,
        total_pages: totalPages,
        has_next_page: currentPage < totalPages,
        has_previous_page: currentPage > 1,
      },
    };
  }

  async findById(id: number) {
    const conversationResult = await db.query.conversation.findFirst({
      where: eq(conversation.id, id),
      with: {
        createdBy: true,
      },
    });

    return conversationResult;
  }

  async create(conversationData: CreateConversationModel) {
    const [newConversation] = await db.insert(conversation).values(conversationData).returning();
    
    return newConversation;
  }
}

export default new ConversationRepository();
