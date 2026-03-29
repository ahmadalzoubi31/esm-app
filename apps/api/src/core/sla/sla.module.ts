import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SlaTarget } from './entities/sla-target.entity';
import { SlaTimer } from './entities/sla-timer.entity';
import { SlaService } from './sla.service';
import { SlaWorker } from './sla.worker';
import { SlaRulesEngineService } from './sla-rules-engine.service';
import { SlaCaseListener } from './sla-case.listener';
import { SlaController } from './sla.controller';
import { PermissionsModule } from '../permissions/permissions.module';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  imports: [
    PermissionsModule,
    MikroOrmModule.forFeature([SlaTarget, SlaTimer]),
  ],
  controllers: [SlaController],
  providers: [
    SlaService,
    SlaWorker,
    SlaRulesEngineService,
    SlaCaseListener,
    CaslAbilityFactory,
  ],
  exports: [SlaService],
})
export class SlaModule {}
