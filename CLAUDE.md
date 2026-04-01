# esm-app — Project Context for Claude Code

## What This Project Does

ESM (العمليات الميدانية) is a full-stack enterprise service management web application.
This file gives Claude Code the full context needed to contribute effectively without repeated explanations.

---

## Monorepo Structure

```
esm-app/                          ← project root (G:\Projects\esm-app)
├── apps/
│   ├── web/                      ← TanStack Router + Vite frontend (main user app)
│   ├── api/                      ← NestJS backend
│   └── admin/                    ← Next.js app for tenant management
├── packages/
│   └── shared/                   ← Shared Zod schemas, types, enums (no build step)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Tech Stack

| Layer        | Technology                                         |
| ------------ | -------------------------------------------------- |
| Frontend     | TanStack Router + Vite (React 19)                  |
| Admin panel  | Next.js (separate app, tenant management only)     |
| Backend      | NestJS 11 + MikroORM + PostgreSQL                  |
| Auth         | JWT + Passport + CASL (permissions)                |
| API style    | REST + GraphQL (Apollo)                            |
| Shared       | `packages/shared` — Zod schemas as source of truth |
| Monorepo     | Turborepo + pnpm workspaces                        |
| Package name | `@repo/shared` (not `@esm/shared`)                 |

---

## Build Commands

```bash
# Install dependencies (from root)
pnpm install

# Build all packages (respects Turborepo pipeline)
pnpm build

# Build a specific app
pnpm --filter api build
pnpm --filter web build
pnpm --filter @repo/shared build

# Dev mode (all apps)
pnpm dev

# Dev mode (single app)
pnpm --filter api dev
pnpm --filter web dev
```

---

## Module System

### packages/shared

- **No build step** — consumed directly from TypeScript source
- `"main"` and `"types"` both point to `./src/index.ts`
- `"module": "ESNext"`, `"moduleResolution": "Bundler"` in tsconfig
- Package name: `@repo/shared`
- All consumers resolve it via pnpm workspace (`"@repo/shared": "workspace:*"`)

### apps/api (NestJS)

- `"module": "commonjs"` in tsconfig (standard NestJS)
- Resolves `@repo/shared` via pnpm workspace — no tsconfig `paths` needed
- NestJS entry point: `src/main.ts` → builds to `dist/main.js`
- Uses `tsconfig-paths` for runtime path resolution

### apps/web (TanStack Router + Vite)

- `"module": "ESNext"`, `"moduleResolution": "bundler"` in tsconfig
- `@/*` path alias maps to `./src/*`
- Resolves `@repo/shared` via pnpm workspace

---

## API Domain Structure

The API is split into two top-level modules:

```
src/
├── core/        ← Platform concerns
│   ├── auth/
│   ├── users/
│   ├── roles/
│   ├── permissions/
│   ├── groups/
│   ├── departments/
│   ├── business-lines/
│   ├── categories/
│   ├── sla/
│   ├── casl/         ← CASL ability factory (permissions engine)
│   └── audit/
└── esm/         ← Business domain
    ├── cases/        ← Cases + attachments + comments
    ├── catalog/      ← Services, service cards, form schemas, service categories
    └── requests/     ← Service requests
```

---

## Frontend Route Structure

TanStack Router file-based routing under `src/routes/`:

```
routes/
├── __root.tsx
├── index.tsx
├── session-timeout.tsx
├── _auth/              ← Unauthenticated layout
│   └── login/
├── _core/              ← Platform admin pages (mirrors core/ in API)
│   ├── dashboard/
│   ├── users/
│   ├── roles/
│   ├── permissions/
│   ├── groups/
│   ├── departments/
│   ├── categories/
│   ├── sla/
│   └── settings/
└── _esm/               ← Business domain pages (mirrors esm/ in API)
    └── cases/
```

---

## packages/shared — Zod Schema Conventions

All shared contracts live in `packages/shared/src/index.ts`. Pattern for each entity:

- `*WriteSchema` — DTO shape (form submission / API input)
- `*ReadSchema` — API response shape (write + server-generated fields like `id`, `createdAt`)
- `*Dto` — TypeScript type inferred from WriteSchema
- `*Schema` — TypeScript type inferred from ReadSchema
- `*EnumSchema` — Zod enum, with a plain `*Enum` object exported for use in code

Always add new shared types here and export from `index.ts`. Never define entity shapes separately in `apps/web` or `apps/api`.

---

## Conventions & Preferences

- **Package manager:** pnpm only (no npm or yarn)
- **Complete files preferred** over step-by-step patches when making changes
- **Shared contracts go in `packages/shared`** — Zod schemas are the single source of truth
- **CASL** is used for authorization — check `core/casl/` before adding any permission logic
- **MikroORM** is the ORM (not TypeORM or Prisma) — use MikroORM patterns for entities and migrations
- Route groups `_core/` and `_esm/` in the frontend mirror the API module split — keep them aligned

---

## Where Things Are

| What                          | Where                                           |
| ----------------------------- | ----------------------------------------------- |
| NestJS entry point            | `apps/api/src/main.ts`                          |
| Shared schemas & types        | `packages/shared/src/index.ts`                  |
| Frontend route tree           | `apps/web/src/routes/`                          |
| Frontend API calls            | `apps/web/src/lib/api/`                         |
| Frontend queries (TanStack)   | `apps/web/src/lib/queries/`                     |
| Frontend mutations (TanStack) | `apps/web/src/lib/mutations/`                   |
| API core modules              | `apps/api/src/core/`                            |
| API business modules          | `apps/api/src/esm/`                             |
| DB migrations                 | `apps/api/src/common/libs/database/migrations/` |
| DB seeders                    | `apps/api/src/common/libs/database/seeders/`    |
| Admin app                     | `apps/admin/` (Next.js, tenant management)      |
| Turborepo pipeline            | `turbo.json`                                    |
| pnpm workspace config         | `pnpm-workspace.yaml`                           |
