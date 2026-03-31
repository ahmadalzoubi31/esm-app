import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { PermissionsModule } from '../permissions/permissions.module';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  imports: [PermissionsModule, MikroOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CaslAbilityFactory],
  exports: [CategoriesService],
})
export class CategoriesModule {}
