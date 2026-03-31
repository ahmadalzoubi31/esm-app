import { Module } from '@nestjs/common';
import { BusinessLineService } from './business-line.service';
import { BusinessLineController } from './business-line.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BusinessLine } from './entities/business-line.entity';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [PermissionsModule, MikroOrmModule.forFeature([BusinessLine])],
  controllers: [BusinessLineController],
  providers: [BusinessLineService, CaslAbilityFactory],
  exports: [BusinessLineService],
})
export class BusinessLineModule {}
