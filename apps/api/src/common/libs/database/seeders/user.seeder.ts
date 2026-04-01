import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User } from '../../../../core/users/entities/user.entity';
import { Tenant } from '../../../../tenants/entities/tenant.entity';
import { Role } from '../../../../core/roles/entities/role.entity';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
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

    // 4. Get the System Tenant
    const tenant = await em.findOneOrFail(Tenant, {
      id: '6da67552-faeb-4507-9f58-0161803afca8',
    });

    // 5. get the system admin role
    const systemAdminRole = await em.findOneOrFail(
      Role,
      {
        name: 'System Administrator',
      },
      { filters: { tenant: false } },
    );

    // 5. Create the user (auto-persists)
    em.create(User, {
      firstName: 'System',
      lastName: 'Admin',
      displayName: 'System Admin',
      username: 'system',
      email: 'admin@system.com',
      password: 'P@ssw0rd',
      authSource: 'local',
      isActive: true,
      isLicensed: true,
      roles: [systemAdminRole],
      tenant,
      permissions: '',
      groups: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await em.flush();
    console.log('✔ UserSeeder completed.');
  }
}
