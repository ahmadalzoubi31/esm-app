# Groups Module

The `GroupsModule` manages organizational Teams and Access Delegation.

## Data Model Overview

- **Group**: Contains `name`, `type`, `businessLineId`.
- **Relations**: Linked to `BusinessLine`, `User` (Members), `Role`, and `Permission`.

## API Operations & Permissions

Access is strictly controlled via `PoliciesGuard` and CASL Filtering.

| Endpoint             | Method | Operation        | Subject | Action     | CASL Filter Applied?         |
| :------------------- | :----- | :--------------- | :------ | :--------- | :--------------------------- |
| `/api/v1/groups`     | POST   | **Create Group** | `Group` | `Create`   | No                           |
| `/api/v1/groups`     | GET    | **List Groups**  | `Group` | `Manage`\* | **Yes** (Row-level security) |
| `/api/v1/groups/:id` | GET    | **Get Group**    | `Group` | `Read`     | **Yes** (Row-level security) |
| `/api/v1/groups/:id` | PATCH  | **Update Group** | `Group` | `Update`   | No                           |
| `/api/v1/groups/:id` | DELETE | **Delete Group** | `Group` | `Delete`   | No                           |

_\* Note: The List endpoint specifically requires the `Manage` permission, which is typically higher privilege than `Read`._

### Operational Flow: List Groups

1. **Client** sends `GET /groups`.
2. **Guard** checks `can(Manage, Group)`.
3. **Controller** extracts `CASL Ability` from request.
4. **Adapter** (`caslToTypeOrm`) converts Ability rules into SQL `Where` clause.
   - _Example_: If user can only manage "IT" groups, the query becomes `SELECT * FROM groups WHERE businessLineKey = 'it'`.
5. **Service** executes filtered query.
6. **Response** returns only accessible groups.

### Operational Flow: Create Group

1. **Client** sends `POST /groups` with `CreateGroupDto`.
2. **Guard** checks `can(Create, Group)`.
3. **Service** validates relationships (Business Line, Team Leader).
4. **DB** persists new Group.
