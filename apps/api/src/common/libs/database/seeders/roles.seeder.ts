import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Role } from '../../../../core/roles/entities/role.entity';
import { Permission } from '../../../../core/permissions/entities/permission.entity';
import { Tenant } from '../../../../tenants/entities/tenant.entity';

export class RoleSeeder extends Seeder {
  data = [
    {
      name: 'System Administrator',
      description:
        'Full system access with all permissions. Can manage all aspects of the system.',
      permissions: ['admin:manage:all'],
    },
    {
      name: 'ESM Administrator',
      description:
        'Manages ESM configuration including workflows, SLAs, services, and business lines.',
      permissions: [
        'workflow:read',
        'workflow:manage',
        'sla:read',
        'sla:manage',
        'service:read',
        'service:manage',
        'business-line:read',
        'business-line:manage',
        'email:read',
        'email:manage',
        'audit:read',
      ],
    },
    {
      name: 'User Administrator',
      description:
        'Manages users, groups, roles, and permissions. Cannot access system-level settings.',
      permissions: [
        'user:manage',
        'user:manage-license',
        'group:manage',
        'role:manage',
        'permission:manage',
        'foundation:people',
        'foundation:support-groups',
        'audit:read',
      ],
    },
    {
      name: 'Foundation Administrator',
      description:
        'Full access to foundation data including users, groups, and categories.',
      permissions: [
        'foundation:manage',
        'foundation:people',
        'foundation:support-groups',
        'foundation:category',
        'user:manage',
        'group:manage',
      ],
    },
    {
      name: 'Service Desk Manager',
      description:
        'Manages service desk operations, can view and update all cases and requests.',
      permissions: [
        'case:create',
        'case:read:any',
        'case:update:any',
        'case:delete',
        'request:create',
        'request:read:any',
        'request:update:any',
        'service:read',
        'service:submit',
        'business-line:read',
        'workflow:read',
        'sla:read',
        'audit:read',
        'notify:manage',
      ],
    },
    {
      name: 'Service Desk Agent',
      description:
        'Handles assigned cases and requests. Can view group cases and update assigned items.',
      permissions: [
        'case:create',
        'case:read:assigned',
        'case:read:group',
        'case:update:assigned',
        'request:create',
        'request:read:assigned',
        'request:read:group',
        'request:update:assigned',
        'service:read',
        'service:submit',
        'business-line:read',
        'notify:manage',
      ],
    },
    {
      name: 'Team Leader',
      description:
        'Leads a support team. Can manage team members and view team cases.',
      permissions: [
        'case:create',
        'case:read:assigned',
        'case:read:group',
        'case:update:assigned',
        'request:create',
        'request:read:assigned',
        'request:read:group',
        'request:update:assigned',
        'service:read',
        'service:submit',
        'group:manage-members',
        'user:manage-group-members',
        'business-line:read',
        'notify:manage',
      ],
    },
    {
      name: 'Service Catalog Manager',
      description: 'Manages service catalog, templates, and service offerings.',
      permissions: [
        'service:read',
        'service:submit',
        'service:manage',
        'business-line:read',
        'business-line:manage',
        'workflow:read',
        'case:read:any',
        'request:read:any',
      ],
    },
    {
      name: 'Auditor',
      description:
        'Read-only access to audit logs and system data for compliance purposes.',
      permissions: [
        'audit:read',
        'case:read:any',
        'request:read:any',
        'service:read',
        'business-line:read',
        'workflow:read',
        'sla:read',
        'email:read',
      ],
    },
    // {
    //   name: 'End User',
    //   description:
    //     'Standard user who can submit requests and view their own cases.',
    //   permissions: [
    //     'case:create',
    //     'case:read:own',
    //     'request:create',
    //     'request:read:own',
    //     'service:read',
    //     'service:submit',
    //     'business-line:read',
    //     'notify:manage',
    //   ],
    // },
  ];

  async run(em: EntityManager, context?: any): Promise<void> {
    // 1: Get repositories
    const roleRepo = em.getRepository(Role);
    const permissionRepo = em.getRepository(Permission);

    const tenantIds = ['6da67552-faeb-4507-9f58-0161803afca8'];

    for (const tenantId of tenantIds) {
      // 3: Get Tenant Reference
      const tenantRef = em.getReference(Tenant, tenantId);

      // 4: Check if any roles already exist for this tenant
      const existingRoles = await roleRepo.find(
        {
          key: { $in: this.data.map((d) => this.generateKey(d.name)) },
          tenant: tenantId,
        },
        { filters: { tenant: false } },
      );

      // 5: If roles exist, skip seeding for this tenant
      if (existingRoles.length > 0) {
        console.log(
          `✔ Roles already exist for tenant ${tenantId}, skipping seed.`,
        );
        continue;
      }

      // 6. Seed each role with its permissions for this tenant
      for (const roleData of this.data) {
        // 6.1. Find permissions by keys
        const permissions = await permissionRepo.find({
          key: { $in: roleData.permissions },
        });

        // 6.2. Warn if some permissions are missing
        if (permissions.length !== roleData.permissions.length) {
          const foundKeys = permissions.map((p) => p.key);
          const missingKeys = roleData.permissions.filter(
            (key) => !foundKeys.includes(key),
          );
          console.warn(
            `⚠ Warning: Role "${roleData.name}" is missing permissions: ${missingKeys.join(', ')}`,
          );
        }

        // 6.3. Create role
        roleRepo.create({
          id: crypto.randomUUID(),
          name: roleData.name,
          key: this.generateKey(roleData.name),
          description: roleData.description,
          permissions: permissions,
          permissionCount: permissions.length,
          tenant: tenantRef,
        });

        console.log(
          `✔ Created role: ${roleData.name} with ${permissions.length} permissions for tenant: ${tenantId}`,
        );
      }
    }

    await em.flush();
    console.log('✔ RoleSeeder completed.');
  }

  private generateKey(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }
}
