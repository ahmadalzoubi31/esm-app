# Database Management Guide

This guide explains how to manage the database using MikroORM CLI commands.

## Table of Contents

- [Quick Start](#quick-start)
- [Migration Commands](#migration-commands)
- [Schema Commands](#schema-commands)
- [Seeder Commands](#seeder-commands)
- [Utility Commands](#utility-commands)
- [Common Workflows](#common-workflows)

---

## Quick Start

### First Time Setup

```bash
# 1. Create initial migration
pnpm run migration:create:initial

# 2. Run migrations
pnpm run migration:up

# 3. Seed the database
pnpm run db:seed
```

### Reset Database (Fresh Start)

```bash
# Drop everything, recreate schema, run migrations, and seed
pnpm run db:fresh
```

---

## Migration Commands

Migrations are versioned database schema changes that can be applied or rolled back.

### `pnpm run migration:create`

Creates a new migration file based on the difference between your current entities and the database schema.

**When to use:**

- After adding/modifying/removing entity properties
- After creating new entities
- After changing relationships between entities

**Example:**

```bash
pnpm run migration:create
```

This will create a file like `Migration20260105123456.ts` in `src/common/libs/database/migrations/`.

---

### `pnpm run migration:create:initial`

Creates an initial migration with all current entities. Use this only when setting up a new database.

**When to use:**

- First time database setup
- Starting fresh with a new database

**Example:**

```bash
pnpm run migration:create:initial
```

---

### `pnpm run migration:up`

Executes all pending migrations in order.

**When to use:**

- After creating new migrations
- When deploying to production/staging
- After pulling changes that include new migrations

**Example:**

```bash
pnpm run migration:up
```

**Output:**

```
✔ Migration20260105123456 successfully executed
```

---

### `pnpm run migration:down`

Rolls back the last executed migration.

**When to use:**

- When you need to undo the last migration
- During development to test migration rollback

**Example:**

```bash
pnpm run migration:down
```

> ⚠️ **Warning:** Be careful in production. This will undo schema changes.

---

### `pnpm run migration:list`

Lists all migrations with their status (executed or pending).

**When to use:**

- To check which migrations have been applied
- To verify migration status before deployment

**Example:**

```bash
pnpm run migration:list
```

**Output:**

```
✔ Migration20260105080615 (executed)
○ Migration20260105123456 (pending)
```

---

### `pnpm run migration:pending`

Shows only pending migrations that haven't been executed yet.

**When to use:**

- Before running `migration:up` to see what will be applied
- To verify new migrations are detected

**Example:**

```bash
pnpm run migration:pending
```

---

### `pnpm run migration:fresh`

Drops the entire database schema and re-runs all migrations from scratch.

**When to use:**

- During development when you want a clean slate
- When migration history is corrupted

**Example:**

```bash
pnpm run migration:fresh
```

> ⚠️ **Warning:** This will delete all data! Use with caution.

---

## Schema Commands

Schema commands directly modify the database schema without using migrations. **Not recommended for production.**

### `pnpm run schema:create`

Creates all database tables based on your entities.

**When to use:**

- Quick prototyping during development
- Setting up a test database

**Example:**

```bash
pnpm run schema:create
```

---

### `pnpm run schema:drop`

Drops all database tables.

**When to use:**

- Cleaning up a development database
- Before running `schema:create`

**Example:**

```bash
pnpm run schema:drop
```

> ⚠️ **Warning:** This will delete all data!

---

### `pnpm run schema:update`

Updates the database schema to match your entities (synchronization mode).

**When to use:**

- Rapid prototyping during development
- Quick fixes in development environment

**Example:**

```bash
pnpm run schema:update
```

> ⚠️ **Warning:** Not recommended for production. Use migrations instead.

---

### `pnpm run schema:fresh`

Drops and recreates the entire database schema.

**When to use:**

- Quick reset during development
- Testing with a clean database

**Example:**

```bash
pnpm run schema:fresh
```

> ⚠️ **Warning:** This will delete all data!

---

## Seeder Commands

Seeders populate the database with initial or test data.

### `pnpm run seeder:run` or `pnpm run db:seed`

Runs the `DatabaseSeeder` which executes all seeders in order.

**What it seeds:**

1. Permissions (59 permissions)
2. Roles (10 roles with assigned permissions)
3. Business Lines (HR, Finance, IT)
4. Users (System Admin user)

**When to use:**

- After running migrations on a fresh database
- When you need to reset test data
- Initial setup

**Example:**

```bash
pnpm run db:seed
```

**Output:**

```
🌱 Starting database seeding...

✔ permissionsData completed.
✔ Created role: System Administrator with 1 permissions
✔ Created role: ESM Administrator with 11 permissions
...
✔ Created business line: HR
✔ Created business line: Finance
✔ Created business line: IT
✔ UserSeeder completed.

✅ Database seeding completed successfully!
```

**Credentials created:**

- Username: `system`
- Password: `P@ssw0rd`
- Email: `admin@system.com`

---

### `pnpm run seeder:create`

Creates a new seeder class file.

**When to use:**

- Adding new seed data for a new entity
- Creating test data seeders

**Example:**

```bash
pnpm run seeder:create --class=ProductSeeder
```

This creates `src/common/libs/database/seeders/ProductSeeder.ts`.

---

## Utility Commands

### `pnpm run cache:clear`

Clears the MikroORM metadata cache.

**When to use:**

- After significant entity changes
- When experiencing strange ORM behavior
- After updating MikroORM version

**Example:**

```bash
pnpm run cache:clear
```

---

### `pnpm run db:fresh`

**The ultimate reset command.** Drops schema, recreates it, runs all migrations, and seeds the database.

**When to use:**

- Complete database reset during development
- After major schema changes
- Setting up a new development environment

**Example:**

```bash
pnpm run db:fresh
```

**What it does:**

1. Drops all tables
2. Recreates schema
3. Runs all migrations
4. Runs all seeders

> ⚠️ **Warning:** This will delete all data!

---

## Common Workflows

### Development Workflow: Adding a New Entity

```bash
# 1. Create your entity file (e.g., Product.entity.ts)

# 2. Create a migration
pnpm run migration:create

# 3. Review the generated migration file

# 4. Apply the migration
pnpm run migration:up

# 5. (Optional) Create and run a seeder for test data
pnpm run seeder:create --class=ProductSeeder
# Edit the seeder file
pnpm run db:seed
```

---

### Development Workflow: Modifying an Entity

```bash
# 1. Modify your entity file

# 2. Create a migration for the changes
pnpm run migration:create

# 3. Review the migration

# 4. Apply the migration
pnpm run migration:up
```

---

### Starting Fresh (Development)

```bash
# Option 1: Using migrations (recommended)
pnpm run migration:fresh
pnpm run db:seed

# Option 2: Complete reset
pnpm run db:fresh
```

---

### Production Deployment

```bash
# 1. Check pending migrations
pnpm run migration:pending

# 2. Run migrations
pnpm run migration:up

# 3. (Optional) Seed initial data if needed
pnpm run db:seed
```

> 💡 **Tip:** Always backup your production database before running migrations!

---

### Checking Database Status

```bash
# List all migrations and their status
pnpm run migration:list

# Check for pending migrations
pnpm run migration:pending
```

---

## Best Practices

### ✅ Do's

- **Always use migrations in production** - Never use schema commands
- **Review migrations before applying** - Check the generated SQL
- **Test migrations locally first** - Ensure they work before deploying
- **Backup before migrations** - Especially in production
- **Version control migrations** - Commit migration files to git
- **Run seeders after fresh migrations** - To populate initial data

### ❌ Don'ts

- **Don't use `schema:update` in production** - Use migrations instead
- **Don't edit executed migrations** - Create a new migration instead
- **Don't delete migration files** - They're part of your schema history
- **Don't run `db:fresh` in production** - You'll lose all data
- **Don't skip migrations** - Run them in order

---

## Troubleshooting

### Migration fails with "table already exists"

```bash
# Drop and recreate (development only)
pnpm run db:fresh
```

### Seeder fails with "already exists"

The seeders are idempotent - they check if data exists before inserting. If you see this message, it's working correctly.

### "Cannot find module" errors

Make sure you're using relative paths in imports, not `src/` prefix:

```typescript
// ❌ Wrong
import { User } from 'src/core/users/entities/user.entity';

// ✅ Correct
import { User } from '../../../../core/users/entities/user.entity';
```

### Cache issues

```bash
pnpm run cache:clear
```

---

## Configuration

MikroORM configuration is located in:

- **Config file:** `src/config/database.ts`
- **CLI config:** `mikro-orm.config.ts`
- **Migrations:** `src/common/libs/database/migrations/`
- **Seeders:** `src/common/libs/database/seeders/`

---

## Additional Resources

- [MikroORM Documentation](https://mikro-orm.io/docs)
- [MikroORM Migrations Guide](https://mikro-orm.io/docs/migrations)
- [MikroORM Seeding Guide](https://mikro-orm.io/docs/seeding)
