import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { BusinessLineSeeder } from './business-line.seeder';
import { PermissionSeeder } from './permissions.seeder';
import { RoleSeeder } from './roles.seeder';
import { UserSeeder } from './user.seeder';
import { TenantSeeder } from './tenant.seeder';
import { DepartmentSeeder } from './department.seeder';
import { GroupSeeder } from './group.seeder';
import { CategorySeeder } from './category.seeder';
import { SlaTargetSeeder } from './sla-target.seeder';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log('🌱 Starting database seeding...\n');

    // Run seeders in order (permissions -> roles -> business lines -> users)
    // This order ensures dependencies are met
    await this.call(em, [
      TenantSeeder,
      PermissionSeeder,
      RoleSeeder,
      BusinessLineSeeder,
      DepartmentSeeder,
      GroupSeeder,
      CategorySeeder,
      SlaTargetSeeder,
      UserSeeder,
    ]);

    console.log('\n✅ Database seeding completed successfully!');
  }
}
