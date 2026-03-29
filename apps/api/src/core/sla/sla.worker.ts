import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SlaTimer } from './entities/sla-timer.entity';
import { SlaBreachedEvent } from './events/sla.event';
import { SlaEvent, SlaEventEnum } from '@repo/shared';

@Injectable()
export class SlaWorker {
  private readonly log = new Logger('SLA');
  private readonly intervalMs = 5_000; // 5 seconds

  constructor(
    private readonly globalEm: EntityManager,
    private readonly eventEmitter: EventEmitter2,
  ) {
    setInterval(
      () => this.tick().catch((e) => this.log.error(e)),
      this.intervalMs,
    );
  }

  /**
   * Tick every 5 seconds and check for breached SLAs
   * used in constructor
   */
  private async tick() {
    // 1: Fork entity manager for background scope
    const em = this.globalEm.fork();

    // 2: Get all running timers
    const runningTimers = await em.find(
      SlaTimer,
      { status: 'Running' },
      { populate: ['target'], limit: 200 },
    );

    // 3: Iterate over running timers
    for (const rt of runningTimers) {
      // 3.a: Calculate elapsed time
      const last = rt.lastTickAt ?? rt.startedAt;
      const elapsed = new Date().getTime() - last.getTime();

      // 3.b: Update remaining time
      rt.remainingMs = Math.max(0, rt.remainingMs - elapsed);

      // 3.c: Update last tick time
      rt.lastTickAt = new Date();

      // 3.d: Check if SLA is breached
      if (rt.remainingMs === 0) {
        // 3.d.i: Update status and breached time
        rt.status = 'Breached';
        rt.breachedAt = new Date();
        await em.flush();

        // 3.d.ii: Emit event
        this.eventEmitter.emit(
          SlaEventEnum['sla.breached'],
          new SlaBreachedEvent({
            caseId: rt.case.id,
            targetId: rt.target.id,
            type: rt.target.type,
            at: rt.breachedAt.toISOString(),
          }),
        );

        // 3.d.iii: Log breach
        this.log.error(
          `SLA BREACHED: Case ${rt.case.id}, Target ${rt.target.id} at ${rt.breachedAt.toISOString()}`,
        );
      } else {
        // 3.e: Save changes
        await em.flush();
      }
    }
  }
}
