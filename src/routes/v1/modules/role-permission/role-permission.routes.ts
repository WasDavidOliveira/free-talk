import RolePermissionController from '@/controllers/v1/modules/role-permission/role-permission.controller';
import { authMiddleware } from '@/middlewares/auth/auth.middlewares';
import { Router } from 'express';

const router = Router();

router.get('/:roleId/all', authMiddleware, RolePermissionController.all);

router.post('/attach', authMiddleware, RolePermissionController.attach);

router.post('/detach', authMiddleware, RolePermissionController.detach);

export default router;
