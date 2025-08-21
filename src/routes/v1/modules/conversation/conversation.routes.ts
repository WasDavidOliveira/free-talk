import ConversationMessagesController from '@/controllers/v1/modules/conversation/conversation-messages.controller';
import ConversationController from '@/controllers/v1/modules/conversation/conversation.controller';
import { authMiddleware } from '@/middlewares/auth/auth.middlewares';
import { validateRequest } from '@/middlewares/validation/validate-request.middlewares';
import { paginationSchema } from '@/validations/v1/base/pagination.validations';
import {
  addParticipantsSchema,
  createConversationSchema,
  parametroConversationSchema,
  removeParticipantSchema,
  updateConversationSchema,
} from '@/validations/v1/modules/conversation.validations';
import {
  conversationParamsSchema,
  createMessageSchema,
  markAsReadSchema,
  messageParamsSchema,
  updateMessageSchema,
} from '@/validations/v1/modules/message.validations';
import { Router } from 'express';

const router: Router = Router();

router.get('/', authMiddleware, validateRequest(paginationSchema), ConversationController.index);

router.get('/:id', authMiddleware, validateRequest(parametroConversationSchema), ConversationController.show);

router.post('/', authMiddleware, validateRequest(createConversationSchema), ConversationController.create);

router.put(
  '/:id',
  authMiddleware,
  validateRequest(parametroConversationSchema),
  validateRequest(updateConversationSchema),
  ConversationController.update,
);

router.delete('/:id', authMiddleware, validateRequest(parametroConversationSchema), ConversationController.delete);

router.post(
  '/:id/participants',
  authMiddleware,
  validateRequest(parametroConversationSchema),
  validateRequest(addParticipantsSchema),
  ConversationController.addParticipants,
);

router.delete(
  '/:id/participants/:userId',
  authMiddleware,
  validateRequest(removeParticipantSchema),
  ConversationController.removeParticipant,
);

router.get(
  '/:id/participants',
  authMiddleware,
  validateRequest(parametroConversationSchema),
  ConversationController.getParticipants,
);

router.get(
  '/:conversationId/messages',
  authMiddleware,
  validateRequest(conversationParamsSchema),
  validateRequest(paginationSchema),
  ConversationMessagesController.index,
);

router.get(
  '/:conversationId/messages/unread-count',
  authMiddleware,
  validateRequest(conversationParamsSchema),
  ConversationMessagesController.getUnreadCount,
);

router.get(
  '/:conversationId/messages/:messageId',
  authMiddleware,
  validateRequest(messageParamsSchema),
  ConversationMessagesController.show,
);

router.post(
  '/:conversationId/messages',
  authMiddleware,
  validateRequest(conversationParamsSchema),
  validateRequest(createMessageSchema),
  ConversationMessagesController.create,
);

router.post(
  '/:conversationId/messages/mark-as-read',
  authMiddleware,
  validateRequest(conversationParamsSchema),
  validateRequest(markAsReadSchema),
  ConversationMessagesController.markAsRead,
);

router.put(
  '/:conversationId/messages/:messageId',
  authMiddleware,
  validateRequest(messageParamsSchema),
  validateRequest(updateMessageSchema),
  ConversationMessagesController.update,
);

router.delete(
  '/:conversationId/messages/:messageId',
  authMiddleware,
  validateRequest(messageParamsSchema),
  ConversationMessagesController.delete,
);

export default router;
