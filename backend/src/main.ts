import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { createLogger } from './logger/logger.factory';
//import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const loggerType = process.env.LOGGER_TYPE?.trim().toLowerCase() || 'dev';

  app.useLogger(createLogger(loggerType));

  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  await app.listen(3000);
  //mongoose.set('debug', true);
}
bootstrap();
