import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { hash } from 'argon2';
import { User } from '../../../../core/users/entities/user.entity';

export class UserSeeder extends Seeder {
  async run(em: EntityManager, context?: any): Promise<void> {
    // 1. Get the repository
    const repo = em.getRepository(User);

    // 2. Check if the user already exists
    const exists = await repo.findOne(
      {
        username: 'system',
      },
      { filters: { tenant: false } },
    );

    // 3. If the user exists, return
    if (exists) {
      console.log('✔ User already exist, skipping seed.');
      return;
    }

    // 4. Hash the password
    // already hashed by mikro-orm subscribe

    // 5. Create the user (auto-persists)
    em.create(User, {
      first_name: 'System',
      last_name: 'Admin',
      display_name: 'System Admin',
      username: 'system',
      email: 'admin@system.com',
      password: 'P@ssw0rd',
      auth_source: 'local',
      is_active: true,
      is_licensed: true,
      tenantId: '6da67552-faeb-4507-9f58-0161803afca8',
    });

    await em.flush();
    console.log('✔ UserSeeder completed.');
  }
}
