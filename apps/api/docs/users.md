# User Management Module

The `UsersModule` handles the lifecycle of user identities.

## Data Model Overview

The `User` entity supports:

- **Local Auth**: Password stored in DB.
- **External Auth**: Source tagged as `ldap` or `azure_ad` with `external_id`.
- **Metadata**: JSONB column for flexible synced attributes.

## API Operations & Permissions

All endpoints require a valid **JWT Access Token**. The `PoliciesGuard` enforces the following permissions:

| Endpoint            | Method | Operation       | Subject | Action   | Note                                        |
| :------------------ | :----- | :-------------- | :------ | :------- | :------------------------------------------ |
| `/api/v1/users`     | POST   | **Create User** | -       | -        | **No Policy Enforced** (Only Auth Required) |
| `/api/v1/users`     | GET    | **List Users**  | `User`  | `Read`   | Returns all users.                          |
| `/api/v1/users/:id` | GET    | **Get User**    | `User`  | `Read`   | Returns single user.                        |
| `/api/v1/users/:id` | PATCH  | **Update User** | `User`  | `Update` | Updates profile fields.                     |
| `/api/v1/users`     | PATCH  | **Bulk Update** | `User`  | `Update` | Updates multiple users by ID.               |
| `/api/v1/users/:id` | DELETE | **Delete User** | `User`  | `Delete` | Removes a user.                             |
| `/api/v1/users`     | DELETE | **Bulk Delete** | `User`  | `Delete` | Removes multiple users.                     |

### Operational Flow: Create User

1. **Client** sends `POST /users` with `CreateUserDto` (username, email, password, etc.).
2. **Controller** calls `UsersService.create`.
3. **Service** checks for existing username/email.
4. **Service** creates `User` entity, hashes password (if provided).
5. **DB** persists the new User.

### Operational Flow: Bulk Update

1. **Client** sends `PATCH /users` with `{ ids: string[], data: UpdateUserDto }`.
2. **Guard** checks `can(Update, User)`.
3. **Service** executes `update` on all matching IDs.
