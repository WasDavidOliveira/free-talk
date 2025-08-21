import { developmentHelmetConfig } from '@/configs/environments/helmet/helmet.development';
import { productionHelmetConfig } from '@/configs/environments/helmet/helmet.production';
import { HelmetOptions } from 'helmet';

const isDevelopment = process.env.NODE_ENV === 'development';

export const helmetConfig: HelmetOptions = isDevelopment ? developmentHelmetConfig : productionHelmetConfig;
