import { Entity, Property, Index } from '@mikro-orm/core';
import type { SlaTargetSchema, SlaTargetRules, SlaType } from '@repo/shared';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';

@Entity({ tableName: 'sla_targets' })
@Index({ properties: ['name'], options: { unique: true } })
export class SlaTarget extends TenantBaseEntity implements SlaTargetSchema {
  @Property({ type: 'string' })
  type!: SlaType;

  @Property()
  name!: string; // e.g., "Respond in 4h"

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ type: 'integer' })
  goalMs!: number; // e.g., 4 * 60 * 60 * 1000

  // Dynamic SLA Rules Configuration
  @Property({ type: 'jsonb' })
  rules!: SlaTargetRules;

  @Property({ default: true })
  isActive: boolean = true;
}
