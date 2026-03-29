import { Entity, Property, ManyToOne, Index } from '@mikro-orm/core';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';
import { Case } from './case.entity';

@Entity({ tableName: 'case_comments' })
@Index({ properties: ['case', 'createdAt'] })
export class CaseComment extends TenantBaseEntity {
  @ManyToOne(() => Case, { deleteRule: 'cascade', fieldName: 'caseId' })
  case!: Case;

  @Property({ type: 'text' })
  body!: string;

  @Property({ default: true })
  isPrivate!: boolean; // true = private (visible to all with case access), false = shared (visible to requester)
}
