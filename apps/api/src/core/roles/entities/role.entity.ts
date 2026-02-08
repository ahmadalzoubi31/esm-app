import {
  Entity,
  PrimaryKey,
  Property,
  ManyToMany,
  Collection,
  Index,
  BeforeCreate,
} from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import { Group } from '../../groups/entities/group.entity';
import { randomUUID } from 'crypto';

@Entity({ tableName: 'roles' })
export class Role {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property({ unique: true })
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

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @BeforeCreate()
  beforeInsert() {
    this.key = this.name.toLowerCase().replace(/\s/g, '-');
  }
}
