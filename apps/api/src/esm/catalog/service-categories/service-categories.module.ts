import { Module } from '@nestjs/common';
import { ServiceCategoriesService } from './service-categories.service';
import { ServiceCategoriesController } from './service-categories.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ServiceCategory } from './entities/service-category.entity';

@Module({
  imports: [MikroOrmModule.forFeature([ServiceCategory])],
  controllers: [ServiceCategoriesController],
  providers: [ServiceCategoriesService],
})
export class ServiceCategoriesModule {}
