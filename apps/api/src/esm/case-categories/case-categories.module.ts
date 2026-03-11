import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CaseCategoriesService } from './case-categories.service';
import { CaseCategoriesController } from './case-categories.controller';
import { CaseCategory } from './entities/case-category.entity';

@Module({
  imports: [MikroOrmModule.forFeature([CaseCategory])],
  controllers: [CaseCategoriesController],
  providers: [CaseCategoriesService],
  exports: [CaseCategoriesService],
})
export class CaseCategoriesModule {}
