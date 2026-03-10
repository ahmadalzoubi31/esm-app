import { BeforeCreate, BeforeUpdate, Property, Entity, OneToMany, Collection } from '@mikro-orm/core';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';
import { User } from '../../users/entities/user.entity';
import { Group } from '../../groups/entities/group.entity';

@Entity({ tableName: 'departments' })
export class Department extends TenantBaseEntity {
  @Property()
  code!: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ default: true })
  active: boolean = true;

  @OneToMany(() => User, (user) => user.department)
  users = new Collection<User>(this);

  @OneToMany(() => Group, (group) => group.department)
  groups = new Collection<Group>(this);

  @BeforeCreate()
  @BeforeUpdate()
  generateCode() {
    if (this.name) {
      this.code = this.name.toLowerCase().replace(/\s+/g, '-');
    }
  }
}
