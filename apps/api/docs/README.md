# ESM Server Documentation

Welcome to the **ESM Server** documentation. This project is a modular Monolith built with **NestJS**, designed to provide backend services for Enterprise Service Management (ITSM, HR, etc.).

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18+
- **PNPM**: Package manager
- **PostgreSQL**: Database
- **Docker** (Optional, for running DB)

### Setup

1.  **Clone and Install**

    ```bash
    git clone <repo-url>
    cd esm-server
    pnpm install
    ```

2.  **Environment Configuration**
    Copy the example environment file and configure your database credentials.

    ```bash
    cp .env.example .env
    ```

    Ensure `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, and `DB_DATABASE` are set.

3.  **Run Development Server**
    ```bash
    pnpm start:dev
    ```
    The server typically runs on `http://localhost:3000`.

## 🏗 Project Structure

The codebase follows a Domain-Driven modular structure inside `src/core`.

| Directory              | Description                                                      |
| :--------------------- | :--------------------------------------------------------------- |
| `src/app.module.ts`    | **Root Module**. Orchestrates global config and DB connections.  |
| `src/core/`            | **Core Domain**. Contains all business logic modules.            |
| `src/core/auth`        | **Authentication**. Strategies (JWT) and session handling.       |
| `src/core/users`       | **User Management**. Profiles, search, sync logic.               |
| `src/core/groups`      | **Teams**. Group management and Business Line associations.      |
| `src/core/roles`       | **RBAC Roles**. Role definitions.                                |
| `src/core/permissions` | **RBAC Permissions**. Granular permission rules.                 |
| `src/core/casl`        | **Authorization**. Policy enforcement logic (`AbilityFactory`).  |
| `src/common`           | **Shared**. Global Guards, Interceptors, Filters, and Utilities. |

## 📚 Documentation Index

- **[Architecture Overview](./architecture.md)**: High-level system design, Auth flow, and Access Control model.
- **[Database Schema](./schema.md)**: Entity Relationship Diagram (ERD) and Data Dictionary.
- **[User Management](./users.md)**: Details on User lifecycle and attributes.
- **[Authentication](./auth.md)**: Login flows and Token management.
- **[Access Control](./access-control.md)**: Guide to Roles, Permissions, and Policy enforcement.
