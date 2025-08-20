import { Router } from 'express';
import ConversationController from '@/controllers/v1/modules/conversation/conversation.controller';
import { validateRequest } from '@/middlewares/validation/validate-request.middlewares';
import { paginationSchema } from '@/validations/v1/base/pagination.validations';
import { authMiddleware } from '@/middlewares/auth/auth.middlewares';
import {
  createConversationSchema,
  parametroConversationSchema,
  updateConversationSchema,
} from '@/validations/v1/modules/conversation.validations';

const router: Router = Router();

router.get(
  '/',
  authMiddleware,
  validateRequest(paginationSchema),
  ConversationController.index
);

router.get(
  '/:id',
  authMiddleware,
  validateRequest(parametroConversationSchema),
  ConversationController.show
);

router.post(
  '/',
  authMiddleware,
  validateRequest(createConversationSchema),
  ConversationController.create
);

router.put(
  '/:id',
  authMiddleware,
  validateRequest(parametroConversationSchema),
  validateRequest(updateConversationSchema),
  ConversationController.update
);

router.delete(
  '/:id',
  authMiddleware,
  validateRequest(parametroConversationSchema),
  ConversationController.delete
);

export default router;
