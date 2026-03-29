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
import { Category } from '../../../core/categories/entities/category.entity';
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

  @ManyToOne(() => Category)
  category!: Category;

  @ManyToOne(() => Category, { nullable: true })
  subcategory?: Category;

  @ManyToOne(() => User, { fieldName: 'requesterId' })
  requester!: User;

  @ManyToOne(() => User, { nullable: true, fieldName: 'assigneeId' })
  assignee?: User;

  @ManyToOne(() => Group, { fieldName: 'assignmentGroupId' })
  assignmentGroup!: Group;

  @ManyToOne(() => BusinessLine, {
    deleteRule: 'cascade',
    fieldName: 'businessLineId',
  })
  businessLine!: BusinessLine;

  @ManyToOne(() => Service, { fieldName: 'affectedServiceId' })
  affectedService!: Service;

  @ManyToOne(() => ServiceCard, {
    nullable: true,
    fieldName: 'requestCardId',
  })
  requestCard?: ServiceCard;

  @OneToMany(() => CaseAttachment, (attachment) => attachment.case)
  attachments = new Collection<CaseAttachment>(this);

  @OneToMany(() => CaseComment, (comment) => comment.case)
  comments = new Collection<CaseComment>(this);
}
