import { StatusCode } from '@/constants/status-code.constants';
import { PermissionResource } from '@/resources/v1/modules/permission/permission.resource';
import RolePermissionService from '@/services/v1/modules/role-permission/role-permission.service';
import { catchAsync } from '@/utils/infrastructure/catch-async.utils';
import { Request, Response } from 'express';

export class RolePermissionController {
  attach = catchAsync(async (req: Request, res: Response) => {
    const { roleId, permissionId } = req.body;

    await RolePermissionService.attach(Number(roleId), Number(permissionId));

    res.status(StatusCode.CREATED).json({
      message: 'Permissão de role associada com sucesso.',
    });
  });

  detach = catchAsync(async (req: Request, res: Response) => {
    const { roleId, permissionId } = req.body;

    await RolePermissionService.detach(Number(roleId), Number(permissionId));

    res.status(StatusCode.OK).json({
      message: 'Permissão de role removida com sucesso.',
    });
  });

  all = catchAsync(async (req: Request, res: Response) => {
    const { roleId } = req.params;

    const permissions = await RolePermissionService.all(Number(roleId));

    return res.json(PermissionResource.collectionToResponse(permissions));
  });
}

export default new RolePermissionController();
