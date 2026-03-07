// tenant-base.entity.ts
import { ManyToOne, Property, PrimaryKey, Filter } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Filter({
  name: 'tenant',
  cond: () => ({ tenant_id: '6da67552-faeb-4507-9f58-0161803afca8' }),
  // cond: (args) => (args.bypass ? {} : { tenant_id: args.tenantId }),
  // default: true, // Enabled by default!
  default: true,
})
export abstract class TenantBaseEntity {
  @PrimaryKey()
  id: string = randomUUID();

  @ManyToOne(() => Tenant, {
    index: true,
    nullable: false,
    fieldNames: ['tenant_id'],
    deleteRule: 'cascade',
  })
  tenant!: Tenant;

  @Property({
    type: 'datetime',
    defaultRaw: 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date = new Date();

  @Property({
    type: 'datetime',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => new Date(),
  })
  updatedAt?: Date = new Date();
}
