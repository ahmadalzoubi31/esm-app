import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'tenants' })
export class Tenant {
  @PrimaryKey({ type: 'uuid' })
  id: string = crypto.randomUUID();

  @Property()
  name!: string;

  @Property({ unique: true })
  code!: string;

  @Property()
  databaseUrl!: string;

  @Property({ default: true })
  isActive: boolean = true;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
