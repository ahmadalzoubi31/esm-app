import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';
import { CaseCategory } from '../../case-categories/entities/case-category.entity';

@Entity({ tableName: 'case_subcategories' })
export class CaseSubcategory extends TenantBaseEntity {
  @Property()
  name!: string;

  @Property()
  description?: string;

  @ManyToOne(() => CaseCategory, { fieldName: 'category_id' })
  category!: CaseCategory;
}
