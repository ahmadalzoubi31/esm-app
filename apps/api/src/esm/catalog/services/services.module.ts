import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ServiceSubscriber } from './subscribers/service.subscriber';
import { Service } from './entities/service.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Service])],
  controllers: [ServicesController],
  providers: [ServicesService, ServiceSubscriber],
  exports: [ServicesService],
})
export class ServicesModule {}
