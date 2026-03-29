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
@Unique({ properties: ['key', 'tenant'] })
export class Role extends TenantBaseEntity implements RoleSchema {
  @Property()
  @Index()
  key!: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ default: 0 })
  permissionCount: number = 0;

  @Property({ default: 0 })
  userCount: number = 0;

  @ManyToMany(() => User, (user) => user.roles, {
    owner: true,
    pivotTable: 'user_roles',
    joinColumn: 'role_id',
    inverseJoinColumn: 'user_id',
  })
  users = new Collection<User>(this);

  @ManyToMany(() => Group, (group) => group.roles, {
    owner: true,
    pivotTable: 'group_roles',
    joinColumn: 'role_id',
    inverseJoinColumn: 'group_id',
  })
  groups = new Collection<Group>(this);

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    owner: true,
    pivotTable: 'role_permissions',
    joinColumn: 'role_id',
    inverseJoinColumn: 'permission_id',
  })
  permissions = new Collection<Permission>(this);

  @BeforeCreate()
  @BeforeUpdate()
  generateKey() {
    this.key = this.name.toLowerCase().replace(/\s/g, '-');
  }
}
