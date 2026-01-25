import {
  BeforeCreate,
  BeforeUpdate,
  Property,
  Entity,
  PrimaryKey,
} from '@mikro-orm/core';
import { randomUUID } from 'crypto';

@Entity({ tableName: 'business_lines' })
export class BusinessLine {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property()
  key!: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ default: true })
  active: boolean = true;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @BeforeCreate()
  @BeforeUpdate()
  generateKey() {
    this.key = this.name.toLowerCase().replace(/\s+/g, '-');
  }
}
