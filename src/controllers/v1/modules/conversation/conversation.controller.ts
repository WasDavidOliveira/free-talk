import { Request, Response } from 'express';
import { catchAsync } from '@/utils/infrastructure/catch-async.utils';
import ConversationService from '@/services/v1/modules/conversation/conversation.service';
import { StatusCode } from '@/constants/status-code.constants';
import { paginationSchema, PaginationInput } from '@/validations/v1/base/pagination.validations';
import { ConversationResource } from '@/resources/v1/modules/conversation/conversation.resource';

export class ConversationController {
  index = catchAsync(async (req: Request<{}, {}, {}, PaginationInput>, res: Response) => {
    const userId = req.userId;
    const pagination = paginationSchema.parse({ query: req.query }).query;

    const conversations = await ConversationService.index(userId, pagination);

    res.status(StatusCode.OK).json({
      message: 'Conversas listadas com sucesso.',
      data: {
        conversations: ConversationResource.collectionToResponse(conversations.data),
        pagination: conversations.pagination,
      },
    });
  });
}

export default new ConversationController();


