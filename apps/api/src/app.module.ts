import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { jwtConfig, serverConfig, databaseConfig } from './config';
import { CoreModule } from './core/core.module';
import { EsmModule } from './esm/esm.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
