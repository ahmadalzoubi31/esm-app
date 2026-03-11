import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CaseSubcategoriesService } from './case-subcategories.service';
import { CaseSubcategoriesController } from './case-subcategories.controller';
import { CaseSubcategory } from './entities/case-subcategory.entity';

@Module({
  imports: [MikroOrmModule.forFeature([CaseSubcategory])],
  controllers: [CaseSubcategoriesController],
  providers: [CaseSubcategoriesService],
  exports: [CaseSubcategoriesService],
})
export class CaseSubcategoriesModule {}
