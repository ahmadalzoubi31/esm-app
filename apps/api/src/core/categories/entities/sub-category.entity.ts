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
import { Category } from './category.entity';

@Entity({ tableName: 'sub_categories' })
export class SubCategory extends TenantBaseEntity implements CategorySchema {
  @Property({ unique: true })
  name!: string;

  @Property()
  description?: string;

  // INVERSE SIDE: Points back to Category.subCategories
  @ManyToMany(() => Category, (category) => category.subCategories, {
    mappedBy: 'subCategories',
  })
  categories = new Collection<Category>(this);
}
