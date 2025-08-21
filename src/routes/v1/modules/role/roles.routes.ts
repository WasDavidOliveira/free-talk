import { PermissionActions } from '@/constants/permission.constants';
import RoleController from '@/controllers/v1/modules/role/role.controller';
import { hasPermission } from '@/middlewares/authorization/permission.middleware';
import { validateRequest } from '@/middlewares/validation/validate-request.middlewares';
import { createRoleSchema, updateRoleSchema } from '@/validations/v1/modules/role.validations';
import { Router } from 'express';

const router = Router();

router.post(
  '/',
  hasPermission('role', PermissionActions.CREATE),
  validateRequest(createRoleSchema),
  RoleController.create,
);

router.get('/all', hasPermission('role', PermissionActions.READ), RoleController.index);

router.get('/:id', hasPermission('role', PermissionActions.READ), RoleController.show);

router.put(
  '/:id',
  hasPermission('role', PermissionActions.UPDATE),
  validateRequest(updateRoleSchema),
  RoleController.update,
);

router.delete('/:id', hasPermission('role', PermissionActions.DELETE), RoleController.delete);

export default router;
