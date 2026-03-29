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
@Unique({ properties: ['key', 'tenant'] })
export class Department extends TenantBaseEntity implements DepartmentSchema {
  @Property()
  @Index()
  key!: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ default: true })
  isActive: boolean = true;

  @OneToMany(() => User, (user) => user.department)
  users = new Collection<User>(this);

  @OneToMany(() => Group, (group) => group.department)
  groups = new Collection<Group>(this);

  @BeforeCreate()
  @BeforeUpdate()
  generateKey() {
    if (this.name) {
      this.key = this.name.toLowerCase().replace(/\s+/g, '-');
    }
  }
}
