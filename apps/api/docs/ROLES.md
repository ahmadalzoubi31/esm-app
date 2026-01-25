# Core Roles Documentation

This document describes the prebuilt core roles in the ESM system and their associated permissions.

## Role Hierarchy

```
System Administrator (Full Access)
├── ESM Administrator (ESM Configuration)
├── User Administrator (IAM Management)
├── Foundation Administrator (Foundation Data)
└── Service Desk Manager
    ├── Service Desk Agent
    └── Team Leader
```

## Role Definitions

### 1. **System Administrator**

- **Key**: `system-administrator`
- **Description**: Full system access with all permissions. Can manage all aspects of the system.
- **Permissions**:
  - `admin:manage:all` - Complete system access
- **Use Case**: IT administrators who need unrestricted access to all system features

---

### 2. **ESM Administrator**

- **Key**: `esm-administrator`
- **Description**: Manages ESM configuration including workflows, SLAs, services, and business lines.
- **Permissions**:
  - Workflow: read, manage
  - SLA: read, manage
  - Service: read, manage
  - Business Line: read, manage
  - Email: read, manage
  - Audit: read
- **Use Case**: ESM platform administrators who configure and maintain the service management system

---

### 3. **User Administrator**

- **Key**: `user-administrator`
- **Description**: Manages users, groups, roles, and permissions. Cannot access system-level settings.
- **Permissions**:
  - User: manage, manage-license
  - Group: manage
  - Role: manage
  - Permission: manage
  - Foundation: people, support-groups
  - Audit: read
- **Use Case**: HR or IT staff responsible for user lifecycle management

---

### 4. **Foundation Administrator**

- **Key**: `foundation-administrator`
- **Description**: Full access to foundation data including users, groups, and categories.
- **Permissions**:
  - Foundation: manage, people, support-groups, category
  - User: manage
  - Group: manage
- **Use Case**: Administrators who manage organizational structure and master data

---

### 5. **Service Desk Manager**

- **Key**: `service-desk-manager`
- **Description**: Manages service desk operations, can view and update all cases and requests.
- **Permissions**:
  - Case: create, read:any, update:any, delete
  - Request: create, read:any, update:any
  - Service: read, submit
  - Business Line: read
  - Workflow: read
  - SLA: read
  - Audit: read
  - Notification: manage
- **Use Case**: Service desk managers who oversee support operations and team performance

---

### 6. **Service Desk Agent**

- **Key**: `service-desk-agent`
- **Description**: Handles assigned cases and requests. Can view group cases and update assigned items.
- **Permissions**:
  - Case: create, read:assigned, read:group, update:assigned
  - Request: create, read:assigned, read:group, update:assigned
  - Service: read, submit
  - Business Line: read
  - Notification: manage
- **Use Case**: Front-line support agents who handle tickets assigned to them or their group

---

### 7. **Team Leader**

- **Key**: `team-leader`
- **Description**: Leads a support team. Can manage team members and view team cases.
- **Permissions**:
  - Case: create, read:assigned, read:group, update:assigned
  - Request: create, read:assigned, read:group, update:assigned
  - Service: read, submit
  - Group: manage-members
  - User: manage-group-members
  - Business Line: read
  - Notification: manage
- **Use Case**: Team leads who manage their support group members and monitor team workload

---

### 8. **Service Catalog Manager**

- **Key**: `service-catalog-manager`
- **Description**: Manages service catalog, templates, and service offerings.
- **Permissions**:
  - Service: read, submit, manage
  - Business Line: read, manage
  - Workflow: read
  - Case: read:any
  - Request: read:any
- **Use Case**: Service owners who design and maintain the service catalog

---

### 9. **Auditor**

- **Key**: `auditor`
- **Description**: Read-only access to audit logs and system data for compliance purposes.
- **Permissions**:
  - Audit: read
  - Case: read:any
  - Request: read:any
  - Service: read
  - Business Line: read
  - Workflow: read
  - SLA: read
  - Email: read
- **Use Case**: Compliance officers or auditors who need read-only access for reporting

---

### 10. **End User**

- **Key**: `end-user`
- **Description**: Standard user who can submit requests and view their own cases.
- **Permissions**:
  - Case: create, read:own
  - Request: create, read:own
  - Service: read, submit
  - Business Line: read
  - Notification: manage
- **Use Case**: Regular employees who submit service requests and track their tickets

---

## Permission Categories

The roles use permissions from these categories:

1. **Case Management** - Managing support cases
2. **Request Management** - Managing service requests
3. **IAM** - Identity and Access Management
4. **Foundation** - Organizational structure and master data
5. **Service** - Service catalog and offerings
6. **Business Line** - Business line configuration
7. **Workflow** - Workflow management
8. **SLA** - Service Level Agreement management
9. **Email** - Email channel management
10. **Audit** - Audit log access
11. **Notification** - User notification preferences
12. **System** - System-level administration

---

## Seeding Order

The seeders must run in this order:

1. **PermissionSeeder** - Creates all permissions first
2. **RoleSeeder** - Creates roles and assigns permissions
3. **UserSeeder** - Creates users and assigns roles

---

## Usage

To run the seeders:

```bash
# Run all seeders
pnpm seed

# Or via npm script
npm run seed
```

The seeder will:

- Skip if roles already exist (idempotent)
- Warn if any permissions are missing
- Log each role creation with permission count

---

## Customization

To add a new role:

1. Add role definition to `roles.seeder.ts` data array
2. Specify name, description, and permission keys
3. Run the seeder

Example:

```typescript
{
  name: 'Custom Role',
  description: 'Description of the role',
  permissions: ['permission:key:1', 'permission:key:2'],
}
```
