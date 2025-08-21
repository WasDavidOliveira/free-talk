import { authMiddleware } from '@/middlewares/auth/auth.middlewares';
import authRoutes from '@/routes/v1/modules/auth/auth.routes';
import conversationRoutes from '@/routes/v1/modules/conversation/conversation.routes';
import permissionRoutes from '@/routes/v1/modules/permission/permission.routes';
import rolePermissionRoutes from '@/routes/v1/modules/role-permission/role-permission.routes';
import roleRoutes from '@/routes/v1/modules/role/roles.routes';
import { Router } from 'express';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/permissions', authMiddleware, permissionRoutes);
router.use('/roles', authMiddleware, roleRoutes);
router.use('/roles-permissions', authMiddleware, rolePermissionRoutes);
router.use('/conversations', authMiddleware, conversationRoutes);

export default router;
