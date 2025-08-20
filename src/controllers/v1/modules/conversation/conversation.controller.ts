import { Request, Response } from 'express';
import { catchAsync } from '@/utils/infrastructure/catch-async.utils';
import ConversationService from '@/services/v1/modules/conversation/conversation.service';
import { StatusCode } from '@/constants/status-code.constants';
import { paginationSchema, PaginationInput } from '@/validations/v1/base/pagination.validations';
import { PaginationResource } from '@/resources/v1/base/pagination/pagination.resource';
import { CreateConversationInput, UpdateConversationInput } from '@/validations/v1/modules/conversation.validations';
import ConversationResource from '@/resources/v1/modules/conversation/conversation.resource';

export class ConversationController {
  index = catchAsync(async (req: Request<{}, {}, {}, PaginationInput>, res: Response) => {
    const userId = req.userId;
    const pagination = paginationSchema.parse({ query: req.query }).query;

    const conversations = await ConversationService.index(userId, pagination);

    res.status(StatusCode.OK).json({
      message: 'Conversas listadas com sucesso.',
      ...PaginationResource.fromRepositoryResult(conversations),
    });
  });

  create = catchAsync(async (req: Request<{}, {}, CreateConversationInput>, res: Response) => {
    const userId = req.userId;
    const conversationData: CreateConversationInput = req.body;
    const conversation = await ConversationService.create(userId, conversationData);

    res.status(StatusCode.CREATED).json({
      message: 'Conversa criada com sucesso.',
      data: await ConversationResource.toResponse(conversation),
    });
  });

  show = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { id } = req.params;

    const conversation = await ConversationService.show(userId, parseInt(id));

    res.status(StatusCode.OK).json({
      message: 'Conversa encontrada com sucesso.',
      data: await ConversationResource.toResponse(conversation),
    });
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { id } = req.params;
    const conversationData: UpdateConversationInput = req.body;

    const conversation = await ConversationService.update(userId, parseInt(id), conversationData);

    res.status(StatusCode.OK).json({
      message: 'Conversa atualizada com sucesso.',
      data: await ConversationResource.toResponse(conversation),
    });
  });
}

export default new ConversationController();