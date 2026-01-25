import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { BusinessLine } from '../../../../core/business-lines/entities/business-line.entity';

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

    // 2. Check if any business lines already exist
    const existingBusinessLines = await businessLineRepo.find({
      key: this.data.map((d) => this.generateKey(d.name)),
    });

    // 3. If business lines exist, skip seeding
    if (existingBusinessLines.length > 0) {
      console.log('✔ Business lines already exist, skipping seed.');
      return;
    }

    // 4. Seed each business line
    for (const blData of this.data) {
      em.create(BusinessLine, {
        id: crypto.randomUUID(),
        key: this.generateKey(blData.name),
        name: blData.name,
        description: blData.description,
        active: true,
      } as any);
      console.log(`✔ Created business line: ${blData.name}`);
    }

    await em.flush();
    console.log('✔ BusinessLineSeeder completed.');
  }

  private generateKey(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }
}
