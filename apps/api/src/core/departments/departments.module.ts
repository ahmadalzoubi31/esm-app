import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Department } from './entities/department.entity';
import { PermissionsModule } from '../permissions/permissions.module';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  imports: [PermissionsModule, MikroOrmModule.forFeature([Department])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, CaslAbilityFactory],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
