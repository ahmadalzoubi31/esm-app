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
import { AuthSource } from '../constants/auth-source.constant';
import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import { Group } from '../../groups/entities/group.entity';
import { Service } from '../../../esm/catalog/services/entities/service.entity';
import { Department } from '../../departments/entities/department.entity';
import { hash } from 'argon2';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';

@Entity({ tableName: 'users' })
export class User extends TenantBaseEntity {
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

  @Property({ nullable: true, hidden: true })
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

  @ManyToMany(() => Role, (role) => role.users)
  roles = new Collection<Role>(this);

  @ManyToMany(() => Permission, (permission) => permission.users)
  permissions = new Collection<Permission>(this);

  @ManyToMany(() => Group, (group) => group.users)
  groups = new Collection<Group>(this);

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
