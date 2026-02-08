import { Module } from '@nestjs/common';
import { TenantOrmService } from './tenant-orm.service';
import { TenantEntityManagerProvider } from './tenant-entity-manager.provider';

@Module({
  providers: [TenantOrmService, TenantEntityManagerProvider],
  exports: [TenantOrmService, TenantEntityManagerProvider],
})
export class TenantOrmModule {}
