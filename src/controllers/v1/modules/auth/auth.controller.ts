import appConfig from '@/configs/app.config';
import { StatusCode } from '@/constants/status-code.constants';
import { UserResource } from '@/resources/v1/modules/user/user.resources';
import AuthService from '@/services/v1/modules/auth/auth.service';
import { catchAsync } from '@/utils/infrastructure/catch-async.utils';
import { LoginInput, RegisterInput, ResetPasswordInput, ChangePasswordInput } from '@/validations/v1/modules/auth.validations';
import { Request, Response } from 'express';

export class AuthController {
  login = catchAsync(async (req: Request<{}, {}, LoginInput>, res: Response) => {
    const result = await AuthService.login(req.body);

    res.status(StatusCode.OK).json({
      message: 'Login realizado com sucesso.',
      token: {
        accessToken: result.token,
        expiresIn: appConfig.jwtExpiration,
        tokenType: 'Bearer',
      },
    });
  });

  register = catchAsync(async (req: Request<{}, {}, RegisterInput>, res: Response) => {
    const user = await AuthService.register(req.body);

    res.status(StatusCode.OK).json({
      message: 'Usuário criado com sucesso.',
      user: UserResource.toResponse(user),
    });
  });

  me = catchAsync(async (req: Request, res: Response) => {
    const user = await AuthService.me(req.userId);

    res.status(StatusCode.OK).json({
      message: 'Usuário encontrado com sucesso.',
      user: UserResource.toResponse(user),
    });
  });

  resetPassword = catchAsync(async (req: Request<{}, {}, ResetPasswordInput>, res: Response) => {
    const result = await AuthService.resetPassword(req.body.email);

    res.status(StatusCode.OK).json({
      message: 'Senha resetada com sucesso.',
      newPassword: result.newPassword,
      user: UserResource.toResponse(result.user),
    });
  });

  changePassword = catchAsync(async (req: Request<{}, {}, ChangePasswordInput>, res: Response) => {
    const user = await AuthService.changePassword(
      req.userId,
      req.body.currentPassword,
      req.body.newPassword
    );

    res.status(StatusCode.OK).json({
      message: 'Senha alterada com sucesso.',
      user: UserResource.toResponse(user),
    });
  });
}

export default new AuthController();
