import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { randomUUID } from 'crypto';

@Entity({ tableName: 'service_categories' })
export class ServiceCategory {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property({ length: 150 })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ nullable: true })
  parentCategoryId?: string;

  @ManyToOne(() => ServiceCategory, { nullable: true })
  parent?: ServiceCategory;

  @OneToMany(() => ServiceCategory, (c) => c.parent)
  children = new Collection<ServiceCategory>(this);
}
