import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Tenant } from '../../../../tenants/entities/tenant.entity';

export class TenantSeeder extends Seeder {
  async run(em: EntityManager, context?: any): Promise<void> {
    // 1. Get the repository
    const repo = em.getRepository(Tenant);

    // 2. Check if the tenant already exists
    const exists = await repo.findOne({
      slug: 'default',
    });

    // 3. If the tenant exists, return
    if (exists) {
      console.log('✔ Tenant already exist, skipping seed.');
      return;
    }

    // 5. Create the default tenant (auto-persists)
    em.create(Tenant, {
      id: '6da67552-faeb-4507-9f58-0161803afca8',
      name: 'Default',
      slug: 'default',
      preferences: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await em.flush();
    console.log('✔ TenantSeeder completed.');
  }
}
