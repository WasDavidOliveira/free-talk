import appConfig from '@/configs/app.config';
import { JwtPayload } from '@/types/core/jwt.types';
import { UnauthorizedError } from '@/utils/core/app-error.utils';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('Token não fornecido');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, appConfig.jwtSecret) as JwtPayload;

    req.userId = decoded.id;

    next();
  } catch {
    throw new UnauthorizedError('Token inválido');
  }
};
