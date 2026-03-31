import {
  Collection,
  Entity,
  OneToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';
import { CategorySchema } from '@repo/shared';

@Entity({ tableName: 'categories' })
export class Category extends TenantBaseEntity implements CategorySchema {
  @Property()
  name!: string;

  @Property()
  description?: string;

  @Property({ default: 1 })
  tier: number = 1;

  @ManyToOne(() => Category, { nullable: true, fieldName: 'parentId' })
  parent?: Category;

  @OneToMany(() => Category, (c) => c.parent)
  children? = new Collection<Category>(this);
}
