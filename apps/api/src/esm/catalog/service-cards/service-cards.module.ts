import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ServiceCardsService } from './service-cards.service';
import { ServiceCardsController } from './service-cards.controller';
import { ServiceCard } from './entities/service-card.entity';

@Module({
  imports: [MikroOrmModule.forFeature([ServiceCard])],
  controllers: [ServiceCardsController],
  providers: [ServiceCardsService],
  exports: [ServiceCardsService],
})
export class ServiceCardsModule {}
