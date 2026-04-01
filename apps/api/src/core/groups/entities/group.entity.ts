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
    inversedBy: 'groups',
  })
  businessLine!: BusinessLine;

  // OWNER: Group "owns" its members
  @ManyToMany(() => User)
  members = new Collection<User>(this);

  // OWNER: Group "owns" its roles
  @ManyToMany(() => Role)
  roles = new Collection<Role>(this);

  // OWNER: Group "owns" its specific permissions
  @ManyToMany(() => Permission)
  permissions = new Collection<Permission>(this);
}
