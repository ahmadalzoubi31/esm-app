import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Permission } from '../../../../core/permissions/entities/permission.entity';

export class PermissionSeeder extends Seeder {
  data = [
    {
      key: 'case:create',
      subject: 'Case',
      action: 'create',
      category: 'Case Management',
      description:
        'Allows creation of new cases. Use this when a user needs to report issues or submit tickets (e.g., standard end-users or agents opening tickets for others).',
    },
    {
      key: 'case:read:any',
      subject: 'Case',
      action: 'read',
      category: 'Case Management',
      description:
        'Grants read-only access to ALL cases in the system. Use this for oversight roles like Service Desk Managers or Auditors who need to view everything but not necessarily edit.',
    },
    {
      key: 'case:read:own',
      subject: 'Case',
      action: 'read',
      category: 'Case Management',
      conditions: {
        field: 'requesterId',
        op: 'eq',
        value: '$user.id',
      },
      description:
        'Allows viewing only cases where the user is the requester. Use this for standard end-users so they can track the status of their own submitted tickets.',
    },
    {
      key: 'case:read:assigned',
      subject: 'Case',
      action: 'read',
      category: 'Case Management',
      conditions: {
        field: 'assigneeId',
        op: 'eq',
        value: '$user.id',
      },
      description:
        'Allows viewing cases specifically assigned to the user. Use this for technicians or agents who need to see their personal workload.',
    },
    {
      key: 'case:read:group',
      subject: 'Case',
      action: 'read',
      category: 'Case Management',
      conditions: {
        field: 'assignmentGroupId',
        op: 'in',
        value: '$user.groupIds',
      },
      description:
        "Allows viewing cases assigned to the user's support groups. Use this for agents working in a team queue where tickets are picked from a shared pool.",
    },
    {
      key: 'case:update:assigned',
      subject: 'Case',
      action: 'update',
      category: 'Case Management',
      conditions: {
        field: 'assigneeId',
        op: 'eq',
        value: '$user.id',
      },
      description:
        'Allows updating details (status, notes, etc.) of cases assigned to the user. Use this for agents who need to work on and resolve their assigned tickets.',
    },
    {
      key: 'case:update:any',
      subject: 'Case',
      action: 'update',
      category: 'Case Management',
      description:
        'Allows updating ANY case in the system. Use this for Team Leads or Managers who may need to intervene, reassign, or close tickets owned by others.',
    },
    {
      key: 'case:delete',
      subject: 'Case',
      action: 'delete',
      category: 'Case Management',
      description:
        'Allows permanent deletion of case records. Use this carefully, typically only for Administrators cleaning up spam or test data.',
    },

    {
      key: 'request:create',
      subject: 'Request',
      action: 'create',
      category: 'Request Management',
      description:
        'Allows submitting new service requests. Use this for any user who needs to request services (e.g., software, hardware, access) from the catalog.',
    },
    {
      key: 'request:read:any',
      subject: 'Request',
      action: 'read',
      category: 'Request Management',
      description:
        'Grants read-only access to ALL service requests. Use this for Fulfillment Managers who need to oversee all request processes.',
    },
    {
      key: 'request:read:own',
      subject: 'Request',
      action: 'read',
      category: 'Request Management',
      conditions: {
        field: 'requesterId',
        op: 'eq',
        value: '$user.id',
      },
      description:
        'Allows viewing only requests submitted by the user. Use this for standard users to track their orders.',
    },
    {
      key: 'request:read:assigned',
      subject: 'Request',
      action: 'read',
      category: 'Request Management',
      conditions: {
        field: 'assigneeId',
        op: 'eq',
        value: '$user.id',
      },
      description:
        'Allows viewing requests assigned to the user. Use this for fulfillment agents (e.g., IT Support) processing specific requests.',
    },
    {
      key: 'request:read:group',
      subject: 'Request',
      action: 'read',
      category: 'Request Management',
      conditions: {
        field: 'assignmentGroupId',
        op: 'in',
        value: '$user.groupIds',
      },
      description:
        "Allows viewing requests assigned to the user's support groups. Use this for fulfillment teams working from a shared queue.",
    },
    {
      key: 'request:update:assigned',
      subject: 'Request',
      action: 'update',
      category: 'Request Management',
      conditions: {
        field: 'assigneeId',
        op: 'eq',
        value: '$user.id',
      },
      description:
        'Allows updating requests assigned to the user. Use this for agents to process, approve, or complete requests in their queue.',
    },
    {
      key: 'request:update:any',
      subject: 'Request',
      action: 'update',
      category: 'Request Management',
      description:
        'Allows updating ANY request in the system. Use this for Fulfillment Managers who need to intervene in requests not assigned to them.',
    },

    {
      key: 'user:manage',
      subject: 'User',
      action: 'manage',
      category: 'IAM',
      description:
        'Allows creating and editing user accounts. Use this for HR staff or IT Administrators responsible for onboarding and offboarding employees.',
    },
    {
      key: 'user:manage-license',
      subject: 'User',
      action: 'manage',
      category: 'IAM',
      description:
        'Allows assigning or revoking licenses. Use this for Asset Managers or IT Admins managing software compliance.',
    },
    {
      key: 'group:manage',
      subject: 'Group',
      action: 'manage',
      category: 'IAM',
      description:
        'Allows creating and editing support groups. Use this for Team Leads setting up their operational structure.',
    },
    {
      key: 'group:manage:all',
      subject: 'Group',
      action: 'manage',
      category: 'IAM',
      description:
        'Allows managing ALL support groups. Use this for System Administrators ensuring consistent group structures across the organization.',
    },
    {
      key: 'role:manage',
      subject: 'Role',
      action: 'manage',
      category: 'IAM',
      description:
        'Allows creating and modifying system roles and their permission sets. Use this ONLY for System Administrators as it affects security access.',
    },
    {
      key: 'permission:manage',
      subject: 'Permission',
      action: 'manage',
      category: 'IAM',
      description:
        'Allows defining system permissions. Use this ONLY for Developers or System Architects; rarely needed for day-to-day operations.',
    },

    {
      key: 'foundation:manage',
      subject: 'Foundation',
      action: 'manage',
      category: 'Foundation',
      description:
        'Full control over foundation data (users, groups, locations). Use this for Master Data Managers or System Admins.',
    },
    {
      key: 'foundation:people',
      subject: 'Foundation',
      action: 'manage',
      category: 'Foundation',
      description:
        'Allows managing person records (departments, locations). Use this for HR or Directory Service Admins.',
    },
    {
      key: 'foundation:support-groups',
      subject: 'Foundation',
      action: 'manage',
      category: 'Foundation',
      description:
        'Allows managing support group definitions. Use this for IT Service Managers organizing support teams.',
    },
    {
      key: 'foundation:category',
      subject: 'Foundation',
      action: 'manage',
      category: 'Foundation',
      description:
        'Allows managing ticket categories (Operational/Product). Use this for Service Process Owners ensuring correct classification.',
    },
    {
      key: 'group:manage-members',
      subject: 'Group',
      action: 'manage',
      category: 'Foundation',
      description:
        'Allows Group Leaders to add/remove members from their own groups. Use this for Team Managers.',
    },
    {
      key: 'user:manage-group-members',
      subject: 'User',
      action: 'manage',
      category: 'Foundation',
      conditions: {
        field: 'groupId',
        op: 'in',
        value: '$user.leaderGroupIds',
      },
      description:
        'Allows Team Leaders to update details of users within their maintained groups. Use this for decentralized user profile management.',
    },

    {
      key: 'service:read',
      subject: 'Service',
      action: 'read',
      category: 'Service',
      description:
        'Allows browsing the service catalog. Use this for all users who need to see what services are available.',
    },
    {
      key: 'service:submit',
      subject: 'Service',
      action: 'create',
      category: 'Service',
      description:
        'Allows submitting requests from the catalog. Use this for all users enabled to consume services.',
    },
    {
      key: 'service:manage',
      subject: 'Service',
      action: 'manage',
      category: 'Service',
      description:
        'Allows creating and editing service offerings and templates. Use this for Service Catalog Managers or Portfolio Owners.',
    },

    {
      key: 'business-line:read',
      subject: 'BusinessLine',
      action: 'read',
      category: 'Business Line',
      description:
        'Allows viewing Business Line configurations. Use this for stakeholders needing visibility into Lob (Line of Business) setups.',
    },
    {
      key: 'business-line:manage',
      subject: 'BusinessLine',
      action: 'manage',
      category: 'Business Line',
      description:
        'Allows setting up Business Lines. Use this for System Architects or MSP Administrators.',
    },

    {
      key: 'workflow:read',
      subject: 'Workflow',
      action: 'read',
      category: 'Workflow',
      description:
        'Allows viewing workflow definitions. Use this for Process Analysts.',
    },
    {
      key: 'workflow:manage',
      subject: 'Workflow',
      action: 'manage',
      category: 'Workflow',
      description:
        'Allows creating and editing workflows. Use this for Process Engineers or Administrators designing automation.',
    },

    {
      key: 'sla:read',
      subject: 'SLA',
      action: 'read',
      category: 'SLA',
      description:
        'Allows viewing SLA configs. Use this for Service Level Managers.',
    },
    {
      key: 'sla:manage',
      subject: 'SLA',
      action: 'manage',
      category: 'SLA',
      description:
        'Allows configuring SLAs. Use this for Service Level Managers defining target times and escalation policies.',
    },

    {
      key: 'email:read',
      subject: 'Email',
      action: 'read',
      category: 'Email',
      description:
        'Allows viewing email logs and channels. Use this for System Administrators troubleshooting mail flow.',
    },
    {
      key: 'email:manage',
      subject: 'Email',
      action: 'manage',
      category: 'Email',
      description:
        'Allows configuring email settings (SMTP/IMAP) and templates. Use this for System Administrators.',
    },

    {
      key: 'audit:read',
      subject: 'Audit',
      action: 'read',
      category: 'Audit',
      description:
        'Allows accessing system audit logs. Use this for Auditors, Compliance Officers, or Admins investigating changes.',
    },

    {
      key: 'notify:manage',
      subject: 'Notification',
      action: 'manage',
      category: 'Notification',
      description:
        'Allows configuring notification rules. Use this for Administrator wanting to set global notification policies.',
    },

    {
      key: 'admin:manage:all',
      subject: 'all',
      action: 'manage',
      category: 'System',
      description:
        'Grants SUPER ADMIN access to everything. Use this ONLY for the highest level System Administrators. Grants ability to destroy or modify any data.',
    },
  ];

  async run(em: EntityManager, context?: any): Promise<void> {
    // 1. Get the repository
    const repo = em.getRepository(Permission);

    // 2. Check if any permissions already exist
    const existingPermissions = await repo.find({
      key: { $in: this.data.map((d) => d.key) },
    });

    // 3. If permissions exist, skip seeding
    if (existingPermissions.length > 0) {
      console.log('✔ Permissions already exist, skipping seed.');
      return;
    }

    // 4. Create and persist all permissions from the data array
    for (const permissionData of this.data) {
      em.create(Permission, {
        id: crypto.randomUUID(),
        ...permissionData,
      } as any);
    }
    await em.flush();

    console.log('✔ permissionsData completed.');
  }
}
