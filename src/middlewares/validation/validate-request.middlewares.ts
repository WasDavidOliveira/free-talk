import { StatusCode } from '@/constants/status-code.constants';
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(StatusCode.BAD_REQUEST).json({
          message: 'Dados inválidos na requisição',
          errors: error.errors.map((e) => ({
            campo: e.path[e.path.length - 1] || e.path.join('.'),
            mensagem: e.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};
