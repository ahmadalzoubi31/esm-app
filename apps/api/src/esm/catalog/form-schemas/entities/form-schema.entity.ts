import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { ServiceCard } from '../../service-cards/entities/service-card.entity';
import { randomUUID } from 'crypto';

@Entity({ tableName: 'service_form_schemas' })
export class ServiceFormSchema {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property()
  serviceCardId!: string;

  @ManyToOne(() => ServiceCard)
  card!: ServiceCard;

  @Property({ type: 'json' })
  jsonSchema!: any;

  @Property({ type: 'json', nullable: true })
  uiSchema?: any;

  @Property({ type: 'json', nullable: true })
  dataSources?: any;

  @Property({ default: true })
  isActive: boolean = true;
}
