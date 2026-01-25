import { randomUUID } from 'node:crypto';
import { ServiceCard } from '../../../../catalog/service-cards/entities/service-card.entity';
import { Service } from '../../../../catalog/services/entities/service.entity';
import {
  Entity,
  PrimaryKey,
  Index,
  Property,
  ManyToOne,
} from '@mikro-orm/core';

@Entity({ tableName: 'service_requests' })
export class ServiceRequest {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property()
  @Index({ options: { unique: true } })
  requestNumber!: string; // e.g. REQ-2025-000123

  // 🔗 direct link to the executable card (Reset Password, Create Account, etc.)
  @ManyToOne(() => ServiceCard, { fieldName: 'serviceCardId' })
  card!: ServiceCard;

  // optional denormalized link to business service for easier reporting
  @ManyToOne(() => Service, { nullable: true, fieldName: 'serviceId' })
  service?: Service;

  @Property()
  requesterUserId!: string;

  @Property({ nullable: true })
  requestedForUserId?: string;

  @Property({ default: 'SUBMITTED' })
  currentStatus:
    | 'SUBMITTED'
    | 'IN_PROGRESS'
    | 'WAITING_FOR_USER'
    | 'COMPLETED'
    | 'REJECTED'
    | 'CANCELED' = 'SUBMITTED';

  @Property({ nullable: true })
  currentAssigneeUserId?: string;

  @Property({ nullable: true })
  currentAssigneeGroupId?: string;

  @Property({ default: 'NORMAL' })
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL' = 'NORMAL';

  @Property({ default: 'Portal' })
  channel: string = 'Portal';

  @Property({ nullable: true })
  slaStatus?: 'ON_TRACK' | 'AT_RISK' | 'BREACHED';

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: 'date', nullable: true })
  closedAt?: Date;

  //   @OneToMany(() => ServiceRequestStatusHistory, (h) => h.request)
  //   history = new Collection<ServiceRequestStatusHistory>(this);

  //   @OneToMany(() => ServiceRequestComment, (c) => c.request)
  //   comments = new Collection<ServiceRequestComment>(this);
}
