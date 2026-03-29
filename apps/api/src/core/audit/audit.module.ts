import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuditLog } from './entities/audit-log.entity';
import { AuditService } from './audit.service';
import { AuditListener } from './audit.listener';

@Module({
  imports: [MikroOrmModule.forFeature([AuditLog])],
  providers: [AuditService, AuditListener],
  exports: [AuditService],
})
export class AuditModule {}
