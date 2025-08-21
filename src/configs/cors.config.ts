import { developmentCorsConfig } from '@/configs/environments/cors/cors.development';
import { productionCorsConfig } from '@/configs/environments/cors/cors.production';
import { CorsOptions } from 'cors';

const isDevelopment = process.env.NODE_ENV === 'development';

export const corsConfig: CorsOptions = isDevelopment ? developmentCorsConfig : productionCorsConfig;
