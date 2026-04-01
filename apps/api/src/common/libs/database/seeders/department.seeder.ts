import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Department } from '../../../../core/departments/entities/department.entity';
import { Tenant } from '../../../../tenants/entities/tenant.entity';

export class DepartmentSeeder extends Seeder {
  data = [
    {
      name: 'Information Technology',
      description: 'Responsible for IT infrastructure and support.',
    },
    {
      name: 'Human Resources',
      description: 'Manages employee relations and recruitment.',
    },
    {
      name: 'Operations',
      description: 'Oversees day-to-day business operations.',
    },
    {
      name: 'Finance',
      description: 'Manages financial planning and accounting.',
    },
  ];

  async run(em: EntityManager): Promise<void> {
    const departmentRepo = em.getRepository(Department);
    const tenantId = '6da67552-faeb-4507-9f58-0161803afca8';
    const tenantRef = em.getReference(Tenant, tenantId);

    for (const deptData of this.data) {
      const key = deptData.name.toLowerCase().replace(/\s+/g, '-');

      const existing = await departmentRepo.findOne(
        {
          name: deptData.name,
          tenant: tenantId,
        },
        { filters: { tenant: false } },
      );

      if (existing) {
        console.log(`✔ Department ${deptData.name} already exists, skipping.`);
        continue;
      }

      em.create(Department, {
        id: crypto.randomUUID(),
        name: deptData.name,
        description: deptData.description,
        tenant: tenantRef,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      });

      console.log(`✔ Created department: ${deptData.name}`);
    }

    await em.flush();
  }
}
