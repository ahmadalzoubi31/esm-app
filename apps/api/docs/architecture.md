# Architecture & System Design

## High-Level Overview

The ESM Server is designed as a **Modular Monolith**. While it runs as a single process (`NestJS`), the code is structured into distinct domain modules to facilitate future extraction into microservices if needed.

```mermaid
graph TD
    Client[Client / Frontend] -->|HTTP / JSON| API[NestJS API Layer]

    subgraph "ESM Server"
        API --> GlobalGuards[Global Guards (Auth/Policies)]
        GlobalGuards --> Controllers[Controllers]

        subgraph "Core Module"
            Controllers --> Services[Domain Services]
            Services --> Repositories[TypeORM Repositories]
            Services --> CASL[CASL Ability Factory]
        end
    end

    Repositories -->|SQL| Database[(PostgreSQL)]
```

## Authentication Flow

Authentication is handled via **JWT (JSON Web Tokens)**.

1.  **Login**: User provides credentials (username/password) to `/auth/login`.
2.  **Tokens**: Server validates credentials and issues:
    - **Access Token** (Short-lived, e.g., 15m). Used for API Authorization.
    - **Refresh Token** (Long-lived, e.g., 7d). Stored in DB (`refreshToken` table) and used to obtain new Access Tokens.
3.  **Requests**: Client sends Access Token in `Authorization: Bearer <token>` header.
4.  **Guard**: `JwtAuthGuard` validates the token signature and expiration.

## Authorization Model (Hybrid RBAC + ABAC)

We use a hybrid approach combining **Role-Based Access Control (RBAC)** and **Attribute-Based Access Control (ABAC)** powered by [CASL](https://casl.js.org/).

### The Hierarchy

1.  **Permission**: The atomic unit of access.
    - _Example_: `Subject: Case`, `Action: read`, `Condition: { "department": "${user.department}" }`.
2.  **Role**: A named collection of Permissions.
    - _Example_: `Role: HR Manager` contains `can read all HR cases`.
3.  **Group**: A Team that can hold Roles and Permissions.
    - _Example_: `Group: HR Team` might have the `HR Staff` role.
4.  **User**: The subject.
    - Inherits Permissions from **Assigned Roles**.
    - Inherits Permissions from **Member Groups** (and their Roles).
    - Can have **Direct Permissions** assigned.

### Policy Enforcement

Authorization is enforced using the `PoliciesGuard` and `@CheckPolicies` decorator.

```typescript
@Get()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@CheckPolicies((ability) => ability.can(Action.Read, 'User'))
findAll() { ... }
```

The `CaslAbilityFactory` aggregates all permissions (Direct + Role-based + Group-based) for a user and compiles them into a CASL Ability object for evaluation.
