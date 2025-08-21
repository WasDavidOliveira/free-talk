import { StatusCode } from '@/constants/status-code.constants';
import { PaginationResource } from '@/resources/v1/base/pagination/pagination.resource';
import ConversationResource from '@/resources/v1/modules/conversation/conversation.resource';
import ConversationService from '@/services/v1/modules/conversation/conversation.service';
import { catchAsync } from '@/utils/infrastructure/catch-async.utils';
import { PaginationInput, paginationSchema } from '@/validations/v1/base/pagination.validations';
import {
  AddParticipantsInput,
  CreateConversationInput,
  RemoveParticipantInput,
  UpdateConversationInput,
} from '@/validations/v1/modules/conversation.validations';
import { Request, Response } from 'express';

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

  delete = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { id } = req.params;

    await ConversationService.delete(userId, parseInt(id));

    res.status(StatusCode.OK).json({
      message: 'Conversa deletada com sucesso.',
    });
  });

  addParticipants = catchAsync(async (req: Request<{ id: string }, {}, AddParticipantsInput>, res: Response) => {
    const userId = req.userId;
    const { id } = req.params;
    const participantsData = req.body;

    const participants = await ConversationService.addParticipants(userId, parseInt(id), participantsData);

    res.status(StatusCode.CREATED).json({
      message: 'Participantes adicionados com sucesso.',
      data: participants,
    });
  });

  removeParticipant = catchAsync(async (req: Request<RemoveParticipantInput>, res: Response) => {
    const requestUserId = req.userId;
    const { id, userId } = req.params;

    await ConversationService.removeParticipant(requestUserId, id, userId);

    res.status(StatusCode.OK).json({
      message: 'Participante removido com sucesso.',
    });
  });

  getParticipants = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { id } = req.params;

    const participants = await ConversationService.getParticipants(userId, parseInt(id));

    res.status(StatusCode.OK).json({
      message: 'Participantes listados com sucesso.',
      data: participants,
    });
  });
}

export default new ConversationController();
