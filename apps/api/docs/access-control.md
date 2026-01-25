# Access Control System

The Application uses a robust, granulart permissions system powered by **CASL**. It moves beyond simple "Admin vs User" roles to allow fine-grained control over resources.

## Core Concepts

### 1. Permissions (The "What")

A `Permission` defines **Access** to a **Resource**.

- **Subject**: The resource type (e.g., `Case`, `User`, `Report`).
- **Action**: The operation (e.g., `read`, `create`, `update`, `delete`, `manage`).
- **Conditions** (Optional): JSON rules restricting access to specific subsets of data.
  - _Example_: `{"department": "${user.department}"}` means "Can only access if the resource's department matches the user's department."

### 2. Roles (The "Bundle")

A `Role` is simply a container for multiple Permissions. It simplifies assignment.

- _Example_: `HR Manager` Role might contain:
  - `user:read:all`
  - `case:read:hr`
  - `case:write:hr`

### 3. Policy Enforcement (The "How")

The `CaslModule` compiles all permissions assigned to a user (via Direct Assignment, Roles, or Groups) into a CASL `Ability`.

- **Duplicate Permissions**: If a user has "Read All" from one role and "Read Own" from another, the most permissive rule typically wins (depending on CASL logic).

## Modules

### Roles Module (`roles`)

Manages the definition of Roles.

- **Endpoints**: `/api/v1/roles` (CRUD for roles).
- **Association**: Assign Permissions to Roles via specific endpoints (e.g., `POST /roles/:id/permissions`).

### Permissions Module (`permissions`)

Manages the definition of granular Permissions.

- **Endpoints**: `/api/v1/permissions`.
- **Optimization**: Permissions are often cached or seeded rather than created dynamically at runtime, but the API supports CRUD for dynamic requirements.

## How to Check Access

In NestJS Controllers, use the `PoliciesGuard`:

```typescript
@UseGuards(PoliciesGuard)
@CheckPolicies((ability) => ability.can(Action.Update, 'Case'))
updateCase() { ... }
```

In Services, inject `CaslAbilityFactory` to check manually:

```typescript
const ability = this.caslAbilityFactory.createForUser(user);
if (!ability.can(Action.Read, subject)) {
  throw new ForbiddenException();
}
```
