import { MikroOrmModule } from '@mikro-orm/nestjs';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig, jwtConfig, serverConfig } from './config';
import { CoreModule } from './core/core.module';
import { EsmModule } from './esm/esm.module';
import { TenantsModule } from './tenants/tenants.module';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { TenantInterceptor } from './common/interceptors/tenant.interceptor';
import { EntityManager } from '@mikro-orm/core';
import { CasesModule } from './esm/cases/cases.module';

@Module({
  imports: [
    TenantsModule,
    EsmModule,
    CoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [serverConfig, jwtConfig, databaseConfig],
    }),
    ScheduleModule.forRoot(),
    MikroOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get('database')!,
      inject: [ConfigService],
    }),
    CasesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ],
})
export class AppModule {}
