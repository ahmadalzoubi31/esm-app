import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { hash } from 'argon2';
import { User } from '../../../../core/users/entities/user.entity';

export class UserSeeder extends Seeder {
  async run(em: EntityManager, context?: any): Promise<void> {
    // 1. Get the repository
    const repo = em.getRepository(User);

    // 2. Check if the user already exists
    const exists = await repo.findOne({
      username: 'system',
    });

    // 3. If the user exists, return
    if (exists) return;

    // 4. Hash the password
    // already hashed by mikro-orm subscribe

    // 5. Create the user (auto-persists)
    em.create(User, {
      id: crypto.randomUUID(),
      first_name: 'System',
      last_name: 'Admin',
      display_name: 'System Admin',
      username: 'system',
      email: 'admin@system.com',
      password: 'P@ssw0rd',
      auth_source: 'local',
      is_active: true,
      is_licensed: true,
    });

    await em.flush();
    console.log('✔ UserSeeder completed.');
  }
}
