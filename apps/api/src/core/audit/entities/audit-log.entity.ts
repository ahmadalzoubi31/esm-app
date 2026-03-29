import { Entity, Property } from '@mikro-orm/core';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';

@Entity({ tableName: 'audit_logs' })
export class AuditLog extends TenantBaseEntity {
  @Property()
  entityType!: string; // e.g., 'case', 'sla'

  @Property()
  entityId!: string; // UUID of the affected entity

  @Property()
  event!: string; // e.g., 'case.status.updated'

  @Property({ type: 'jsonb', nullable: true })
  payload?: Record<string, any>;
}
