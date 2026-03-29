import { BeforeCreate, BeforeUpdate, Property, Entity } from '@mikro-orm/core';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';

import { BusinessLineSchema } from '@repo/shared';

@Entity({ tableName: 'business_lines' })
export class BusinessLine
  extends TenantBaseEntity
  implements BusinessLineSchema
{
  @Property()
  key!: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ default: true })
  isActive: boolean = true;

  @BeforeCreate()
  @BeforeUpdate()
  generateKey() {
    this.key = this.name.toLowerCase().replace(/\s+/g, '-');
  }
}
