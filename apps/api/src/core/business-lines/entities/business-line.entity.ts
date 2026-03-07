import {
  BeforeCreate,
  BeforeUpdate,
  Property,
  Entity,
  PrimaryKey,
} from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';

@Entity({ tableName: 'business_lines' })
export class BusinessLine extends TenantBaseEntity {
  @Property()
  key!: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ default: true })
  active: boolean = true;

  @BeforeCreate()
  @BeforeUpdate()
  generateKey() {
    this.key = this.name.toLowerCase().replace(/\s+/g, '-');
  }
}
