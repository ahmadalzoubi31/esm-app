import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Tenant } from '../../../../tenants/entities/tenant.entity';

export class TenantSeeder extends Seeder {
  async run(em: EntityManager, context?: any): Promise<void> {
    // 1. Get the repository
    const repo = em.getRepository(Tenant);

    // 2. Check if the user already exists
    const exists = await repo.findOne({
      slug: 'system',
    });

    // 3. If the user exists, return
    if (exists) {
      console.log('✔ Tenant already exist, skipping seed.');
      return;
    }

    // 5. Create the user (auto-persists)
    em.create(Tenant, {
      id: '6da67552-faeb-4507-9f58-0161803afca8',
      name: 'System',
      slug: 'system',
      preferences: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await em.flush();
    console.log('✔ TenantSeeder completed.');
  }
}
