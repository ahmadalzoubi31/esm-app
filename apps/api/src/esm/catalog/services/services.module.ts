import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Service } from './entities/service.entity';
import { ServiceSubscriber } from './subscribers/service.subscriber';

@Module({
  imports: [MikroOrmModule.forFeature([Service])],
  controllers: [ServicesController],
  providers: [ServicesService, ServiceSubscriber],
})
export class ServicesModule {}
