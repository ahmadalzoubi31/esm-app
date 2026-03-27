import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '../../.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { VersioningType } from '@nestjs/common';
import { setupSwagger } from './common/libs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import requestID from 'express-request-id';
import cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(bootstrap.name);

  // ## request id ##
  app.use(requestID());

  // ## cookie parser ##
  app.use(cookieParser());

  // ## cors ##
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3005'],
    credentials: true,
  });

  // ## prefix ##
  app.setGlobalPrefix('api');

  // ## versioning ##
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // ## Pips ##
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ## Global Interceptors ##
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // ## exception filter ##
  app.useGlobalFilters(new AllExceptionsFilter());

  // ## swagger ##
  setupSwagger(app);

  // ## listen ##
  await app.listen(process.env.API_PORT ?? 5000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
