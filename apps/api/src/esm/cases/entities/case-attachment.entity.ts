import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { TenantBaseEntity } from '../../../common/entities/tenant-base.entity';
import { Case } from './case.entity';

@Entity({ tableName: 'case_attachments' })
export class CaseAttachment extends TenantBaseEntity {
  @ManyToOne(() => Case, { deleteRule: 'cascade', fieldName: 'case_id' })
  case!: Case;

  @Property()
  filename!: string;

  @Property()
  originalName!: string;

  @Property()
  mimeType!: string;

  @Property({ type: 'integer' })
  size!: number;

  @Property()
  storagePath!: string;
}
