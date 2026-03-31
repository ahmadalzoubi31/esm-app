// tenant-base.entity.ts
import { ManyToOne, Property, PrimaryKey, Filter } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Filter({
  name: 'tenant',
  cond: (args) => (args.bypass ? {} : { tenant: { id: args.tenantId } }),
})
export abstract class TenantBaseEntity {
  @PrimaryKey()
  id: string = randomUUID();

  @ManyToOne(() => Tenant, {
    index: true,
    nullable: false,
    fieldNames: ['tenantId'],
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

  @Property({ default: true })
  isActive: boolean = true;
}
