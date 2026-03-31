import {
  Entity,
  PrimaryKey,
  Property,
  ManyToMany,
  Collection,
  Index,
} from '@mikro-orm/core';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';
import { Group } from '../../groups/entities/group.entity';
import { randomUUID } from 'crypto';
import type { PermissionDto } from '@repo/shared';

@Entity({ tableName: 'permissions' })
export class Permission implements PermissionDto {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property({ unique: true })
  @Index()
  key!: string; // e.g., "case:read:own"

  @Property()
  subject!: string; // e.g., "Case" or "all"

  @Property()
  action!: string; // e.g., "read", "update", "manage"

  @Property({ type: 'json', nullable: true })
  conditions?: Record<string, any>;

  @Property()
  category!: string;

  @Property({ nullable: true })
  description?: string;

  // INVERSE SIDE: Points back to Role.permissions
  @ManyToMany(() => Role, (role) => role.permissions, {
    mappedBy: 'permissions',
  })
  roles = new Collection<Role>(this);

  // INVERSE SIDE: Points back to Group.permissions
  @ManyToMany(() => Group, (group) => group.permissions, {
    mappedBy: 'permissions',
  })
  groups = new Collection<Group>(this);

  // INVERSE SIDE: Points back to User.permissions
  @ManyToMany(() => User, (user) => user.permissions, {
    mappedBy: 'permissions',
  })
  users = new Collection<User>(this);

  @Property({ onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
