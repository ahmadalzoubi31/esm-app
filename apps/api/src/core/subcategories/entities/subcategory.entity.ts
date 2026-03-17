import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity({ tableName: 'subcategories' })
export class Subcategory extends TenantBaseEntity {
  @Property()
  name!: string;

  @Property()
  description?: string;

  @ManyToOne(() => Category, { fieldName: 'category_id' })
  category!: Category;
}
