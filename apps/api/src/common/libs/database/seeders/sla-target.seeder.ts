import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { SlaTarget } from '../../../../core/sla/entities/sla-target.entity';
import { Tenant } from '../../../../tenants/entities/tenant.entity';
import { CaseStatus } from '../../../../esm/cases/constants/case-status.constant';
import { CASE_EVENTS } from '../../../../esm/cases/constants/case-events.constant';

export class SlaTargetSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const tenantId = '6da67552-faeb-4507-9f58-0161803afca8';
    const tenantRef = em.getReference(Tenant, tenantId);
    const targetRepo = em.getRepository(SlaTarget);

    const defaultTargets = [
      {
        type: 'response',
        name: 'Response SLA (4h)',
        goalMs: 4 * 60 * 60 * 1000,
        rules: {
          startTriggers: [{ event: CASE_EVENTS.CREATED, action: 'start' }],
          stopTriggers: [
            { event: CASE_EVENTS.ASSIGNEE_UPDATED, action: 'stop' },
          ],
          pauseTriggers: [],
          resumeTriggers: [],
        },
      },
      {
        type: 'resolution',
        name: 'Resolution SLA (24h)',
        goalMs: 24 * 60 * 60 * 1000,
        rules: {
          startTriggers: [{ event: CASE_EVENTS.CREATED, action: 'start' }],
          stopTriggers: [
            {
              event: CASE_EVENTS.STATUS_UPDATED,
              conditions: [
                {
                  field: 'status',
                  operator: 'in',
                  value: [CaseStatus.RESOLVED, CaseStatus.CLOSED],
                },
              ],
              action: 'stop',
            },
          ],
          pauseTriggers: [
            {
              event: CASE_EVENTS.STATUS_UPDATED,
              conditions: [
                {
                  field: 'status',
                  operator: 'equals',
                  value: CaseStatus.PENDING,
                },
              ],
              action: 'pause',
            },
          ],
          resumeTriggers: [
            {
              event: CASE_EVENTS.STATUS_UPDATED,
              conditions: [
                {
                  field: 'status',
                  operator: 'equals',
                  value: CaseStatus.IN_PROGRESS,
                },
              ],
              action: 'resume',
            },
          ],
        },
      },
    ];

    for (const targetData of defaultTargets) {
      const existing = await targetRepo.findOne(
        { name: targetData.name, tenant: tenantId },
        { filters: { tenant: false } },
      );

      if (!existing) {
        em.create(SlaTarget, {
          ...targetData,
          tenant: tenantRef,
          isActive: true,
        } as any);
        console.log(`✔ Created SLA target: ${targetData.name}`);
      } else {
        console.log(
          `✔ SLA target ${targetData.name} already exists, skipping.`,
        );
      }
    }

    await em.flush();
  }
}
