import {
  BeforeCreate,
  BeforeUpdate,
  Property,
  Entity,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';

import { BusinessLineSchema } from '@repo/shared';
import { Group } from '../../groups/entities/group.entity';

@Entity({ tableName: 'business_lines' })
export class BusinessLine
  extends TenantBaseEntity
  implements BusinessLineSchema
{
  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @OneToMany(() => Group, (group) => group.businessLine)
  groups = new Collection<Group>(this);
}
