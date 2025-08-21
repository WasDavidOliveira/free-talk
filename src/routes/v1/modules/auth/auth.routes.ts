import AuthController from '@/controllers/v1/modules/auth/auth.controller';
import { authMiddleware } from '@/middlewares/auth/auth.middlewares';
import { validateRequest } from '@/middlewares/validation/validate-request.middlewares';
import { loginSchema, registerSchema } from '@/validations/v1/modules/auth.validations';
import { Router } from 'express';

const router: Router = Router();

router.post('/login', validateRequest(loginSchema), AuthController.login);

router.post('/register', validateRequest(registerSchema), AuthController.register);

router.get('/me', authMiddleware, AuthController.me);

export default router;
