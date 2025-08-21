import { corsConfig } from '@/configs/cors.config';
import { helmetConfig } from '@/configs/helmet.config';
import { configureDocs } from '@/middlewares/core/docs.middleware';
import { errorHandler, notFoundHandler } from '@/middlewares/core/error-hander.middleware';
import { globalRateLimiter } from '@/middlewares/core/rate-limit.middleware';
import router from '@/routes/router';
import cors from 'cors';
import express, { ErrorRequestHandler } from 'express';
import helmet from 'helmet';

export const bootstrapMiddlewares = (app: express.Application) => {
  app.set('trust proxy', 1);

  app.use(cors(corsConfig));

  app.use(helmet(helmetConfig));

  app.use(globalRateLimiter);

  app.use(express.json());

  configureDocs(app);

  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler as ErrorRequestHandler);
};
