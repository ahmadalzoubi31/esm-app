import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { VersioningType } from '@nestjs/common';
import { setupSwagger } from './common/libs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import requestID from 'express-request-id';
import { Logger } from '@nestjs/common';
// import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(bootstrap.name);
  // ## request id ##
  app.use(requestID());

  // ## cookie parser ##
  // app.use(cookieParser());

  // ## cors ##
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // ## prefix ##
  app.setGlobalPrefix('api');

  // ## versionsing ##
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
  await app.listen(process.env.PORT ?? 3035);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
