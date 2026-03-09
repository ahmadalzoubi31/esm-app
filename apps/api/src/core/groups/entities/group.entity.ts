import {
  Entity,
  PrimaryKey,
  ManyToOne,
  Property,
  ManyToMany,
  Collection,
} from '@mikro-orm/core';
import { GROUP_TYPE_ENUM } from '../constants/group-type.constant';
import { BusinessLine } from '../../business-lines/entities/business-line.entity';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import { randomUUID } from 'crypto';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';

@Entity({ tableName: 'groups' })
export class Group extends TenantBaseEntity {
  @Property({ length: 120 })
  name!: string;

  @Property({ type: 'string' })
  type!: GROUP_TYPE_ENUM;

  @Property({ nullable: true })
  description?: string;

  @ManyToOne(() => User, { nullable: true, fieldName: 'teamLeaderId' })
  teamLeader?: User;

  @Property({ nullable: true })
  businessLineKey?: string;

  @ManyToOne(() => BusinessLine, { fieldName: 'businessLineId', nullable: true })
  businessLine?: BusinessLine;

  @ManyToMany(() => Role, (role) => role.groups)
  roles = new Collection<Role>(this);

  @ManyToMany(() => Permission, (permission) => permission.groups)
  permissions = new Collection<Permission>(this);

  @ManyToMany(() => User, (user) => user.groups, {
    owner: true,
    pivotTable: 'group_users',
    joinColumn: 'groupId',
    inverseJoinColumn: 'userId',
  })
  users = new Collection<User>(this);
}
