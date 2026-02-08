import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { jwtConfig, serverConfig, systemDatabaseConfig } from './config';
import { TenantsModule } from './system/tenants/tenants.module';

@Module({
  imports: [
    TenantsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [serverConfig, jwtConfig, systemDatabaseConfig],
    }),
    MikroOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get('systemDatabase')!,
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
