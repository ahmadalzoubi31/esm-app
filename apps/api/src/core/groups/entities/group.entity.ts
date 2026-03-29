import {
  Entity,
  PrimaryKey,
  ManyToOne,
  Property,
  ManyToMany,
  Collection,
} from '@mikro-orm/core';
import { BusinessLine } from '../../business-lines/entities/business-line.entity';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import { Department } from '../../departments/entities/department.entity';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';
import { GroupSchema, GroupType } from '@repo/shared';

@Entity({ tableName: 'groups' })
export class Group extends TenantBaseEntity implements GroupSchema {
  @Property({ length: 120 })
  name!: string;

  @Property({ type: 'string' })
  type!: GroupType;

  @Property({ nullable: true })
  description?: string;

  @ManyToOne(() => User, { nullable: true, fieldName: 'teamLeaderId' })
  teamLeader?: User;

  @ManyToOne(() => BusinessLine, {
    fieldName: 'businessLineId',
  })
  businessLine: BusinessLine;

  @ManyToOne(() => Department, { nullable: true })
  department?: Department;

  @ManyToMany(() => Role, (role) => role.groups)
  roles: Role[];

  @ManyToMany(() => Permission, (permission) => permission.groups)
  permissions: Permission[];

  @ManyToMany(() => User, (user) => user.groups, {
    owner: true,
    pivotTable: 'group_users',
    joinColumn: 'groupId',
    inverseJoinColumn: 'userId',
  })
  users: string[];
}
