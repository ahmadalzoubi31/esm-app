import {
  Entity,
  PrimaryKey,
  Property,
  ManyToMany,
  Collection,
  Index,
  BeforeCreate,
  Unique,
  BeforeUpdate,
} from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import { Group } from '../../groups/entities/group.entity';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';
import { RoleSchema } from '@repo/shared';

@Entity({ tableName: 'roles' })
@Unique({ properties: ['name', 'tenant'] })
export class Role extends TenantBaseEntity implements RoleSchema {
  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ default: 0 })
  permissionCount?: number = 0;

  @Property({ default: 0 })
  userCount?: number = 0;

  // OWNER: Role "owns" its permissions
  @ManyToMany(() => Permission)
  permissions = new Collection<Permission>(this);

  // INVERSE SIDE: Points back to User.roles
  @ManyToMany(() => User, (user) => user.roles, { mappedBy: 'roles' })
  users = new Collection<User>(this);

  // INVERSE SIDE: Points back to Group.roles
  @ManyToMany(() => Group, (group) => group.roles, { mappedBy: 'roles' })
  groups = new Collection<Group>(this);
}
