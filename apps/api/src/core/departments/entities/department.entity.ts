import {
  BeforeCreate,
  BeforeUpdate,
  Property,
  Entity,
  OneToMany,
  Collection,
  Index,
  Unique,
} from '@mikro-orm/core';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';
import { User } from '../../users/entities/user.entity';
import { Group } from '../../groups/entities/group.entity';
import type { DepartmentSchema } from '@repo/shared';

@Entity({ tableName: 'departments' })
@Unique({ properties: ['name', 'tenant'] })
export class Department extends TenantBaseEntity implements DepartmentSchema {
  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @OneToMany(() => User, (user) => user.department)
  users = new Collection<User>(this);
}
