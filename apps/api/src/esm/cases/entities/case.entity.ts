import {
  Entity,
  Property,
  ManyToOne,
  Index,
  Enum,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';
import { User } from '../../../core/users/entities/user.entity';
import { Group } from '../../../core/groups/entities/group.entity';
import { BusinessLine } from '../../../core/business-lines/entities/business-line.entity';
import { Service } from '../../catalog/services/entities/service.entity';
import { ServiceCard } from '../../catalog/service-cards/entities/service-card.entity';
import { CaseCategory } from '../../case-categories/entities/case-category.entity';
import { CaseSubcategory } from '../../case-subcategories/entities/case-subcategory.entity';
import { CaseStatus } from '../constants/case-status.constant';
import { CasePriority } from '../constants/case-priority.constant';
import { CaseAttachment } from './case-attachment.entity';
import { CaseComment } from './case-comment.entity';

@Entity({ tableName: 'cases' })
export class Case extends TenantBaseEntity {
  @Property({ length: 30 })
  @Index({ options: { unique: true } })
  number!: string;

  @Property({ length: 50 })
  title!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Enum({ items: () => CaseStatus, default: CaseStatus.NEW })
  status: CaseStatus = CaseStatus.NEW;

  @Enum({ items: () => CasePriority, default: CasePriority.MEDIUM })
  priority: CasePriority = CasePriority.MEDIUM;

  @ManyToOne(() => CaseCategory)
  category!: CaseCategory;

  @ManyToOne(() => CaseSubcategory)
  subcategory?: CaseSubcategory;

  @ManyToOne(() => User, { fieldName: 'requester_id' })
  requester!: User;

  @ManyToOne(() => User, { nullable: true, fieldName: 'assignee_id' })
  assignee?: User;

  @ManyToOne(() => Group, { fieldName: 'assignment_group_id' })
  assignmentGroup!: Group;

  @ManyToOne(() => BusinessLine, {
    deleteRule: 'cascade',
    fieldName: 'business_line_id',
  })
  businessLine!: BusinessLine;

  @ManyToOne(() => Service, { fieldName: 'affected_service_id' })
  affectedService!: Service;

  @ManyToOne(() => ServiceCard, {
    nullable: true,
    fieldName: 'request_card_id',
  })
  requestCard?: ServiceCard;

  @OneToMany(() => CaseAttachment, (attachment) => attachment.case)
  attachments = new Collection<CaseAttachment>(this);

  @OneToMany(() => CaseComment, (comment) => comment.case)
  comments = new Collection<CaseComment>(this);
}
