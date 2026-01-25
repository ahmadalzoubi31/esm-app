import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { ServiceFormSchema } from '../../form-schemas/entities/form-schema.entity';
import { randomUUID } from 'crypto';

@Entity({ tableName: 'service_cards' })
export class ServiceCard {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  // 🔗 business service parent (Active Directory, Email, etc.)
  // @ManyToOne(() => Service, (s) => s.cards, { onDelete: 'CASCADE', fieldName: 'serviceId' })
  // service!: Service;

  // 🖼 catalog UI information
  @Property({ length: 200 })
  displayTitle!: string;

  @Property({ type: 'text', nullable: true })
  shortDescription?: string;

  @Property({ nullable: true })
  icon?: string;

  @Property({ nullable: true })
  colorTheme?: string;

  @Property({ type: 'integer', default: 0 })
  displayOrder: number = 0;

  @Property({ type: 'json', nullable: true })
  badges?: string[]; // ["NEW", "POPULAR"]

  // ⚙ behavior configuration
  @Property({ default: true })
  isRequestable: boolean = true;

  @Property({ nullable: true })
  workflowId?: string; // pointer to workflow definition

  @Property({ type: 'json', nullable: true })
  expectedSla?: {
    responseMinutes?: number;
    resolutionMinutes?: number;
  };

  // 👀 who can use this card (simple version, you can later replace with policy engine)
  @Property({ type: 'json', nullable: true })
  visibilityRules?: {
    roles?: string[];
    groups?: string[];
    businessLines?: string[];
  };

  @OneToMany(() => ServiceFormSchema, (f) => f.card)
  formSchemas = new Collection<ServiceFormSchema>(this);
}
