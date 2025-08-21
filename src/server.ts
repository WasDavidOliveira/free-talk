import appConfig from '@/configs/app.config';
import { bootstrapMiddlewares } from '@/middlewares/core/bootstrap.middleware';
import { logger } from '@/utils/core/logger.utils';
import 'dotenv/config';
import express from 'express';

const app = express();

bootstrapMiddlewares(app);

app.listen(appConfig.port, () => {
  logger.serverStartup(appConfig.nodeEnv, appConfig.port as number);
});

export default app;
