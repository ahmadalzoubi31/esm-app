import {
  Collection,
  Entity,
  OneToMany,
  ManyToOne,
  Property,
  ManyToMany,
} from '@mikro-orm/core';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';
import { CategorySchema } from '@repo/shared';
import { SubCategory } from './sub-category.entity';

@Entity({ tableName: 'categories' })
export class Category extends TenantBaseEntity implements CategorySchema {
  @Property({ unique: true })
  name!: string;

  @Property()
  description?: string;

  // OWNER: Category "owns" their child categories
  @ManyToMany(() => SubCategory)
  subCategories? = new Collection<SubCategory>(this);
}
