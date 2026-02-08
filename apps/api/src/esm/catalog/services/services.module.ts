import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ServiceSubscriber } from './subscribers/service.subscriber';

@Module({
  imports: [],
  controllers: [ServicesController],
  providers: [ServicesService, ServiceSubscriber],
})
export class ServicesModule {}
