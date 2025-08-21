import { PermissionActions } from '@/constants/permission.constants';
import PermissionController from '@/controllers/v1/modules/permission/permission.controller';
import { hasPermission } from '@/middlewares/authorization/permission.middleware';
import { validateRequest } from '@/middlewares/validation/validate-request.middlewares';
import { createPermissionSchema, updatePermissionSchema } from '@/validations/v1/modules/permission.validations';
import { Router } from 'express';

const router = Router();

router.post(
  '/',
  hasPermission('user', PermissionActions.CREATE),
  validateRequest(createPermissionSchema),
  PermissionController.create,
);

router.get('/:id', hasPermission('user', PermissionActions.READ), PermissionController.show);

router.delete('/:id', hasPermission('user', PermissionActions.DELETE), PermissionController.delete);

router.put(
  '/:id',
  hasPermission('user', PermissionActions.UPDATE),
  validateRequest(updatePermissionSchema),
  PermissionController.update,
);

export default router;
