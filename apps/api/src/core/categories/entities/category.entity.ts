import {
  Collection,
  Entity,
  OneToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';

@Entity({ tableName: 'categories' })
export class Category extends TenantBaseEntity {
  @Property()
  name!: string;

  @Property()
  description?: string;

  @Property({ default: 1 })
  tier: number = 1;

  @ManyToOne(() => Category, { nullable: true })
  parent?: Category;

  @OneToMany(() => Category, (c) => c.parent)
  children = new Collection<Category>(this);
}
