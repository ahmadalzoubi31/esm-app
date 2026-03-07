import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { BusinessLine } from '../../../../core/business-lines/entities/business-line.entity';
import { Tenant } from '../../../../tenants/entities/tenant.entity';

export class BusinessLineSeeder extends Seeder {
  data = [
    {
      key: 'hr',
      name: 'HR',
      description:
        'The HR business line is responsible for managing human resources and ensuring the smooth operation of the organization.',
    },
    {
      key: 'finance',
      name: 'Finance',
      description:
        "The Finance business line is responsible for managing the organization's financial resources and ensuring the smooth operation of the organization.",
    },
    {
      key: 'it',
      name: 'IT',
      description:
        "The IT business line is responsible for managing the organization's IT resources and ensuring the smooth operation of the organization.",
    },
  ];

  async run(em: EntityManager, context?: any): Promise<void> {
    // 1. Get repositories
    const businessLineRepo = em.getRepository(BusinessLine);

    const tenantIds = [
      '6da67552-faeb-4507-9f58-0161803afca8',
      '5beb697a-d171-4716-8d79-cb3b42bb0d19',
    ];

    for (const tenantId of tenantIds) {
      const tenantRef = em.getReference(Tenant, tenantId);

      // 2. Check if any business lines already exist for this tenant
      const existingBusinessLines = await businessLineRepo.find(
        {
          key: { $in: this.data.map((d) => this.generateKey(d.name)) },
          tenant: tenantId,
        },
        { filters: { tenant: false } },
      );

      // 3. If business lines exist, skip seeding
      if (existingBusinessLines.length > 0) {
        console.log(
          `✔ Business lines already exist for tenant ${tenantId}, skipping seed.`,
        );
        continue;
      }

      // 4. Seed each business line
      for (const blData of this.data) {
        em.create(BusinessLine, {
          id: crypto.randomUUID(),
          key: this.generateKey(blData.name),
          name: blData.name,
          description: blData.description,
          active: true,
          tenant: tenantRef,
        } as any);
        console.log(
          `✔ Created business line: ${blData.name} for tenant ${tenantId}`,
        );
      }
    }

    await em.flush();
    console.log('✔ BusinessLineSeeder completed.');
  }

  private generateKey(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }
}
