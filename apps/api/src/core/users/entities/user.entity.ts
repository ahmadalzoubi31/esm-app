import {
  Entity,
  PrimaryKey,
  Property,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Collection,
  BeforeCreate,
  BeforeUpdate,
  Enum,
} from '@mikro-orm/core';
import { AuthSource } from '@repo/shared';
import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import { Group } from '../../groups/entities/group.entity';
import { Service } from '../../../esm/catalog/services/entities/service.entity';
import { Department } from '../../departments/entities/department.entity';
import { hash } from 'argon2';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';

import { UserSchema } from '@repo/shared';

@Entity({ tableName: 'users' })
export class User extends TenantBaseEntity implements UserSchema {
  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property({ length: 80, unique: true })
  @Index()
  username!: string;

  @Property({ nullable: true })
  @Property({ length: 150, nullable: true })
  email?: string;

  @Property({ length: 150 })
  displayName?: string;

  @Property()
  avatar?: string;

  @ManyToOne(() => Department, { nullable: true })
  department?: Department;

  @Property()
  phone?: string;

  @Property()
  manager?: string;

  @Enum({ items: () => ['local', 'ldap'] })
  authSource!: AuthSource;

  @Property({ nullable: true })
  externalId?: string; // AD GUID

  @Property({ nullable: true })
  password?: string; // only for 'local' users

  @Property({ default: false })
  isActive: boolean = false;

  @Property({ nullable: true })
  lastLoginAt?: Date;

  @Property({ default: false })
  isLicensed: boolean = false;

  @Property({ type: 'json', nullable: true })
  metadata?: {
    // LDAP synced attributes
    phone?: string;
    mobile?: string;
    title?: string;
    company?: string;
    employeeId?: string;
    employeeType?: string;
    location?: string;
    city?: string;
    state?: string;
    country?: string;
    userPrincipalName?: string;

    // Any custom attributes from LDAP
    [key: string]: any;
  };

  // OWNER: User "owns" their assigned roles
  @ManyToMany(() => Role)
  roles = new Collection<Role>(this);

  // INVERSE SIDE: Group manages membership
  @ManyToMany(() => Group, (group) => group.members, { mappedBy: 'members' })
  groups = new Collection<Group>(this);

  // OWNER: User "owns" their direct permissions
  @ManyToMany(() => Permission)
  permissions = new Collection<Permission>(this);

  @BeforeCreate()
  @BeforeUpdate()
  async setPassword() {
    if (!this.password) return;
    this.password = await hash(this.password);
  }

  @BeforeCreate()
  @BeforeUpdate()
  async updateDisplayName() {
    this.displayName = `${this.firstName} ${this.lastName}`;
  }
}
