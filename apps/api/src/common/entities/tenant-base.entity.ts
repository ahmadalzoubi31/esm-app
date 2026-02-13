// tenant-base.entity.ts
import { Property, PrimaryKey, Filter } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

@Filter({
  name: 'tenant',
  cond: (args) => ({ tenantId: args.tenantId }),
  default: true, // Enabled by default!
})
export abstract class TenantBaseEntity {
  @PrimaryKey()
  id: string = randomUUID();

  @Property({ index: true }) // Indexing is CRITICAL for performance in Option 3
  tenantId!: string;

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
