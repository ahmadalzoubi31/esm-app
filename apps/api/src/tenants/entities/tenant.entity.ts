import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

@Entity()
export class Tenant {
  @PrimaryKey()
  id: string = randomUUID();

  @Property({ unique: true })
  name!: string;

  @Property({ unique: true })
  slug!: string;

  @Property({ type: 'jsonb', default: '{}' })
  preferences: Record<string, any> = {};

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
