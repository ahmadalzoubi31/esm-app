import { Property, Entity, ManyToOne, PrimaryKey, Enum } from '@mikro-orm/core';
import { User } from '../../../../core/users/entities/user.entity';
import { ServiceLifecycleStatus } from '../dto/create-service.dto';
import { randomUUID } from 'crypto';

@Entity({ tableName: 'services' })
export class Service {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property({ unique: true })
  code!: string;

  @Property({ length: 200 })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ type: 'text', nullable: true })
  longDescription?: string;

  // @Property()
  // categoryId!: string;

  // @ManyToOne(() => ServiceCategory, (c) => c.services)
  // category!: ServiceCategory;

  @ManyToOne(() => User, { nullable: true, fieldName: 'ownerUserId' })
  ownerUser?: User;

  @Enum({
    items: () => ServiceLifecycleStatus,
    default: ServiceLifecycleStatus.ACTIVE,
  })
  lifecycleStatus: ServiceLifecycleStatus;

  // @OneToMany(() => ServiceCard, (c) => c.service)
  // cards = new Collection<ServiceCard>(this);

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
