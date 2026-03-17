import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Category } from '../../../../core/categories/entities/category.entity';
import { Tenant } from '../../../../tenants/entities/tenant.entity';

export class CategorySeeder extends Seeder {
  data = [
    {
      name: 'Hardware',
      description: 'Physical equipment and devices.',
    },
    {
      name: 'Software',
      description: 'Application and system software issues.',
    },
    {
      name: 'Access Management',
      description: 'User accounts, permissions, and security access.',
    },
    {
      name: 'Network',
      description: 'Connectivity, internet, and VPN issues.',
    },
    {
      name: 'Email & Collaboration',
      description: 'Outlook, Teams, and other communication tools.',
    },
  ];

  async run(em: EntityManager): Promise<void> {
    const categoryRepo = em.getRepository(Category);
    const tenantId = '6da67552-faeb-4507-9f58-0161803afca8';
    const tenantRef = em.getReference(Tenant, tenantId);

    for (const catData of this.data) {
      const existing = await categoryRepo.findOne(
        {
          name: catData.name,
          tenant: tenantId,
        },
        { filters: { tenant: false } },
      );

      if (existing) {
        console.log(`✔ Category ${catData.name} already exists, skipping.`);
        continue;
      }

      em.create(Category, {
        id: crypto.randomUUID(),
        name: catData.name,
        description: catData.description,
        tenant: tenantRef,
      } as any);

      console.log(`✔ Created case category: ${catData.name}`);
    }

    await em.flush();
  }
}
