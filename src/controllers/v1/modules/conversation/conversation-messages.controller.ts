import { StatusCode } from '@/constants/status-code.constants';
import { PaginationResource } from '@/resources/v1/base/pagination/pagination.resource';
import MessageResource from '@/resources/v1/modules/message/message.resource';
import MessageService from '@/services/v1/modules/message/message.service';
import { catchAsync } from '@/utils/infrastructure/catch-async.utils';
import { PaginationInput, paginationSchema } from '@/validations/v1/base/pagination.validations';
import {
  ConversationParamsInput,
  CreateMessageInput,
  MarkAsReadInput,
  MessageParamsInput,
  UpdateMessageInput,
} from '@/validations/v1/modules/message.validations';
import { Request, Response } from 'express';

export class ConversationMessagesController {
  index = catchAsync(async (req: Request<ConversationParamsInput, {}, {}, PaginationInput>, res: Response) => {
    const userId = req.userId;
    const { conversationId } = req.params;
    const pagination = paginationSchema.parse({ query: req.query }).query;

    const messages = await MessageService.getMessagesByConversation(userId, conversationId, pagination);

    res.status(StatusCode.OK).json({
      message: 'Mensagens listadas com sucesso.',
      ...PaginationResource.fromRepositoryResult({
        ...messages,
        data: await MessageResource.toResponseArray(messages.data),
      }),
    });
  });

  show = catchAsync(async (req: Request<MessageParamsInput>, res: Response) => {
    const userId = req.userId;
    const { conversationId, messageId } = req.params;

    const message = await MessageService.getMessageById(userId, conversationId, messageId);

    res.status(StatusCode.OK).json({
      message: 'Mensagem encontrada com sucesso.',
      data: await MessageResource.toResponse(message),
    });
  });

  create = catchAsync(async (req: Request<ConversationParamsInput, {}, CreateMessageInput>, res: Response) => {
    const userId = req.userId;
    const { conversationId } = req.params;
    const messageData = req.body;

    const message = await MessageService.createMessage(userId, conversationId, messageData);

    res.status(StatusCode.CREATED).json({
      message: 'Mensagem criada com sucesso.',
      data: await MessageResource.toResponse(message),
    });
  });

  update = catchAsync(async (req: Request<MessageParamsInput, {}, UpdateMessageInput>, res: Response) => {
    const userId = req.userId;
    const { conversationId, messageId } = req.params;
    const messageData = req.body;

    const message = await MessageService.updateMessage(userId, conversationId, messageId, messageData);

    res.status(StatusCode.OK).json({
      message: 'Mensagem atualizada com sucesso.',
      data: await MessageResource.toResponse(message),
    });
  });

  delete = catchAsync(async (req: Request<MessageParamsInput>, res: Response) => {
    const userId = req.userId;
    const { conversationId, messageId } = req.params;

    await MessageService.deleteMessage(userId, conversationId, messageId);

    res.status(StatusCode.OK).json({
      message: 'Mensagem deletada com sucesso.',
    });
  });

  markAsRead = catchAsync(async (req: Request<ConversationParamsInput, {}, MarkAsReadInput>, res: Response) => {
    const userId = req.userId;
    const { conversationId } = req.params;
    const markAsReadData = req.body;

    await MessageService.markMessagesAsRead(userId, conversationId, markAsReadData);

    res.status(StatusCode.OK).json({
      message: 'Mensagens marcadas como lidas com sucesso.',
    });
  });

  getUnreadCount = catchAsync(async (req: Request<ConversationParamsInput>, res: Response) => {
    const userId = req.userId;
    const { conversationId } = req.params;

    const result = await MessageService.getUnreadCount(userId, conversationId);

    res.status(StatusCode.OK).json({
      message: 'Contagem de mensagens não lidas obtida com sucesso.',
      data: result,
    });
  });
}

export default new ConversationMessagesController();
