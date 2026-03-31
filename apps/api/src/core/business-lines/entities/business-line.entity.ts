import {
  BeforeCreate,
  BeforeUpdate,
  Property,
  Entity,
  Collection,
  OneToMany,
  Index,
} from '@mikro-orm/core';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';

import { BusinessLineSchema } from '@repo/shared';
import { Group } from '../../groups/entities/group.entity';

@Entity({ tableName: 'business_lines' })
@Index({ name: 'idx_business_line_name', properties: ['name'] })
export class BusinessLine
  extends TenantBaseEntity
  implements BusinessLineSchema
{
  @Property({ unique: true })
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @OneToMany(() => Group, (group) => group.businessLine)
  groups = new Collection<Group>(this);
}
