import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';

@Entity({ tableName: 'case_categories' })
export class CaseCategory extends TenantBaseEntity {
  @Property()
  name!: string;

  @Property()
  description?: string;
}
