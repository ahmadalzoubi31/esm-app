import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Subcategory } from '../../../../core/subcategories/entities/subcategory.entity';
import { Category } from '../../../../core/categories/entities/category.entity';
import { Tenant } from '../../../../tenants/entities/tenant.entity';

export class SubcategorySeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const subcategoryRepo = em.getRepository(Subcategory);
    const categoryRepo = em.getRepository(Category);
    const tenantId = '6da67552-faeb-4507-9f58-0161803afca8';
    const tenantRef = em.getReference(Tenant, tenantId);

    const categories = [
      {
        name: 'Hardware',
        subcategories: [
          {
            name: 'Laptop',
            description: 'Issues with company-issued laptops.',
          },
          { name: 'Desktop', description: 'Issues with desktop workstations.' },
          { name: 'Mobile Device', description: 'Smartphones and tablets.' },
          {
            name: 'Peripherals',
            description: 'Mice, keyboards, monitors, etc.',
          },
          { name: 'Printer', description: 'Printing and scanning issues.' },
        ],
      },
      {
        name: 'Software',
        subcategories: [
          { name: 'Operating System', description: 'Windows or macOS issues.' },
          { name: 'Office 365', description: 'Word, Excel, PowerPoint, etc.' },
          {
            name: 'ERP System',
            description: 'Enterprise Resource Planning software.',
          },
          {
            name: 'Custom Application',
            description: 'In-house developed tools.',
          },
        ],
      },
      {
        name: 'Access Management',
        subcategories: [
          {
            name: 'Password Reset',
            description: 'Request to reset forgotten passwords.',
          },
          {
            name: 'New User Onboarding',
            description: 'Setup for new employees.',
          },
          {
            name: 'Permission Change',
            description: 'Modifying existing access rights.',
          },
          {
            name: 'Account Lockout',
            description: 'Unlocking disabled accounts.',
          },
        ],
      },
    ];

    for (const catInfo of categories) {
      const category = await categoryRepo.findOne(
        {
          name: catInfo.name,
          tenant: tenantId,
        },
        { filters: { tenant: false } },
      );

      if (!category) {
        console.warn(
          `⚠ Could not find category ${catInfo.name}. Skipping subcategories for it.`,
        );
        continue;
      }

      for (const subData of catInfo.subcategories) {
        const existing = await subcategoryRepo.findOne(
          {
            name: subData.name,
            category: (category as any).id,
            tenant: tenantId,
          },
          { filters: { tenant: false } },
        );

        if (existing) {
          console.log(
            `✔ Subcategory ${subData.name} already exists for ${catInfo.name}, skipping.`,
          );
          continue;
        }

        em.create(Subcategory, {
          id: crypto.randomUUID(),
          name: subData.name,
          description: subData.description,
          category: category as any,
          tenant: tenantRef,
        } as any);

        console.log(
          `✔ Created case subcategory: ${subData.name} under ${catInfo.name}`,
        );
      }
    }

    await em.flush();
  }
}
