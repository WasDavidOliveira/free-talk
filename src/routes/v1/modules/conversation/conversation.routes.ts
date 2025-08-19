import { Router } from 'express';
import ConversationController from '@/controllers/v1/modules/conversation/conversation.controller';
import { validateRequest } from '@/middlewares/validation/validate-request.middlewares';
import { paginationSchema } from '@/validations/v1/base/pagination.validations';
import { authMiddleware } from '@/middlewares/auth/auth.middlewares';

const router: Router = Router();

router.get('/', authMiddleware, validateRequest(paginationSchema), ConversationController.index);

export default router;