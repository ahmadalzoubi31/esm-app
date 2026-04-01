import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Category } from '../../../../core/categories/entities/category.entity';
import { Tenant } from '../../../../tenants/entities/tenant.entity';

export class CategorySeeder extends Seeder {
  data = [
    {
      name: 'Hardware',
      description: 'Physical equipment and devices.',
      subcategories: [
        { name: 'Laptop', description: 'Issues with company laptops.' },
        { name: 'Desktop', description: 'Issues with company desktops.' },
        { name: 'Printer', description: 'Printing and scanning issues.' },
        { name: 'Mobile Device', description: 'Phones and tablets.' },
      ],
    },
    {
      name: 'Software',
      description: 'Application and system software issues.',
      subcategories: [
        {
          name: 'Operating System',
          description: 'Windows, macOS, Linux issues.',
        },
        {
          name: 'Microsoft Office',
          description: 'Word, Excel, PowerPoint, etc.',
        },
        {
          name: 'Specialized Software',
          description: 'Industry-specific applications.',
        },
      ],
    },
    {
      name: 'Access Management',
      description: 'User accounts, permissions, and security access.',
      subcategories: [
        {
          name: 'Password Reset',
          description: 'Account lockout or password change.',
        },
        {
          name: 'New Account Setup',
          description: 'Onboarding new user accounts.',
        },
        {
          name: 'Permission Modification',
          description: 'Requesting access to systems/files.',
        },
      ],
    },
    {
      name: 'Network',
      description: 'Connectivity, internet, and VPN issues.',
      subcategories: [
        { name: 'Wi-Fi', description: 'Wireless internet connectivity.' },
        { name: 'VPN', description: 'Virtual Private Network access.' },
        {
          name: 'Wired Connection',
          description: 'Ethernet connectivity issues.',
        },
      ],
    },
    {
      name: 'Email & Collaboration',
      description: 'Outlook, Teams, and other communication tools.',
      subcategories: [
        { name: 'Outlook', description: 'Email client and server issues.' },
        { name: 'Teams', description: 'Chat, meetings, and calls.' },
        { name: 'SharePoint', description: 'Document sharing and intranet.' },
      ],
    },
  ];

  async run(em: EntityManager): Promise<void> {
    const categoryRepo = em.getRepository(Category);
    const tenantId = '6da67552-faeb-4507-9f58-0161803afca8';
    const tenantRef = em.getReference(Tenant, tenantId);

    for (const catData of this.data) {
      let parent = await categoryRepo.findOne(
        {
          name: catData.name,
          tenant: tenantId,
          tier: 1,
        },
        { filters: { tenant: false } },
      );

      if (!parent) {
        parent = em.create(Category, {
          id: crypto.randomUUID(),
          name: catData.name,
          description: catData.description,
          tenant: tenantRef,
          tier: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
        });
        console.log(`✔ Created category: ${catData.name}`);
      } else {
        console.log(`✔ Category ${catData.name} already exists, skipping.`);
      }

      if (catData.subcategories) {
        for (const subCatData of catData.subcategories) {
          const subExisting = await categoryRepo.findOne(
            {
              name: subCatData.name,
              parent: parent.id,
              tenant: tenantId,
              tier: 2,
            },
            { filters: { tenant: false } },
          );

          if (!subExisting) {
            em.create(Category, {
              id: crypto.randomUUID(),
              name: subCatData.name,
              description: subCatData.description,
              tenant: tenantRef,
              tier: 2,
              parent: parent,
              createdAt: new Date(),
              updatedAt: new Date(),
              isActive: true,
            });
            console.log(`  └─ ✔ Created subcategory: ${subCatData.name}`);
          } else {
            console.log(
              `  └─ ✔ Subcategory ${subCatData.name} already exists, skipping.`,
            );
          }
        }
      }
    }

    await em.flush();
  }
}
