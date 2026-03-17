import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';
import { Subcategory } from '../../subcategories/entities/subcategory.entity';

@Entity({ tableName: 'categories' })
export class Category extends TenantBaseEntity {
  @Property()
  name!: string;

  @Property()
  description?: string;

  @OneToMany(() => Subcategory, (s) => s.category)
  subcategories = new Collection<Subcategory>(this);
}
