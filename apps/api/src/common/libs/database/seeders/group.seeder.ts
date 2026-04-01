import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Group } from '../../../../core/groups/entities/group.entity';
import { BusinessLine } from '../../../../core/business-lines/entities/business-line.entity';
import { Department } from '../../../../core/departments/entities/department.entity';
import { Tenant } from '../../../../tenants/entities/tenant.entity';
import { GroupTypeEnum } from '@repo/shared';

export class GroupSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const groupRepo = em.getRepository(Group);
    const businessLineRepo = em.getRepository(BusinessLine);
    const departmentRepo = em.getRepository(Department);
    const tenantId = '6da67552-faeb-4507-9f58-0161803afca8';
    const tenantRef = em.getReference(Tenant, tenantId);

    // Get dependencies
    const itBusinessLine = await businessLineRepo.findOne(
      { name: 'IT', tenant: tenantId },
      { filters: { tenant: false } },
    );
    const itDepartment = await departmentRepo.findOne(
      { name: 'Information Technology', tenant: tenantId },
      { filters: { tenant: false } },
    );

    if (!itBusinessLine || !itDepartment) {
      console.warn(
        '⚠ Could not find IT Business Line or IT Department. Skipping Group seeding for IT.',
      );
    } else {
      const groups = [
        {
          name: 'IT Service Desk',
          type: GroupTypeEnum['help-desk'],
          description: 'First point of contact for IT issues.',
        },
        {
          name: 'Network Operations',
          type: GroupTypeEnum['tier-2'],
          description: 'Manages network infrastructure and connectivity.',
        },
        {
          name: 'Security Operations',
          type: GroupTypeEnum['tier-2'],
          description: 'Handles security monitoring and incident response.',
        },
        {
          name: 'App Support Tier 1',
          type: GroupTypeEnum['tier-1'],
          description: 'Intermediate support for enterprise applications.',
        },
      ];

      for (const groupData of groups) {
        const existing = await groupRepo.findOne(
          {
            name: groupData.name,
            tenant: tenantId,
          },
          { filters: { tenant: false } },
        );

        if (existing) {
          console.log(`✔ Group ${groupData.name} already exists, skipping.`);
          continue;
        }

        em.create(Group, {
          id: crypto.randomUUID(),
          name: groupData.name,
          type: groupData.type,
          description: groupData.description,
          businessLine: itBusinessLine,
          tenant: tenantRef,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
        });

        console.log(`✔ Created group: ${groupData.name}`);
      }
    }

    await em.flush();
  }
}
