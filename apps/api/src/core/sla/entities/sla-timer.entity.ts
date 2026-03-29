import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { SlaTarget } from './sla-target.entity';
import { Case } from '../../../esm/cases/entities/case.entity';

@Entity({ tableName: 'sla_timers' })
@Index({ properties: ['case', 'target'], options: { unique: true } })
export class SlaTimer {
  @PrimaryKey()
  id: string = randomUUID();

  @ManyToOne(() => Case, { deleteRule: 'cascade', fieldName: 'caseId' })
  case!: Case;

  @ManyToOne(() => SlaTarget, { deleteRule: 'cascade', fieldName: 'targetId' })
  target!: SlaTarget;

  @Property({ type: 'datetime', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @Property({ type: 'timestamptz' })
  startedAt!: Date;

  @Property({ type: 'timestamptz', nullable: true })
  stoppedAt?: Date;

  @Property({ type: 'timestamptz', nullable: true })
  breachedAt?: Date;

  @Property({ type: 'timestamptz', nullable: true })
  lastTickAt?: Date;

  @Property({ type: 'integer' })
  remainingMs!: number;

  @Property({ default: 'Running' })
  status!: 'Running' | 'Stopped' | 'Breached' | 'Paused' | 'Met';

  // Pause/Resume tracking
  @Property({ type: 'timestamptz', nullable: true })
  pausedAt?: Date;

  @Property({ type: 'timestamptz', nullable: true })
  resumedAt?: Date;

  @Property({ type: 'integer', default: 0 })
  totalPausedMs: number = 0;
}
