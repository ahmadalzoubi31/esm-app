import * as path from 'path';
import * as fs from 'fs';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, SqliteDriver } from '@mikro-orm/sqlite';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

import { Tenant } from './tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);

  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: EntityRepository<Tenant>,
    private readonly em: EntityManager,
  ) {}

  async createTenant(dto: CreateTenantDto): Promise<Tenant> {
    const existing = await this.tenantRepo.findOne({ code: dto.code });
    if (existing) {
      throw new BadRequestException('Tenant code already exists');
    }

    // 1. Generate Database Name
    // Ensure safe db name (only alphanumeric and underscore)
    const dbName = `esm_tenant_${dto.code.replace(/[^a-z0-9_]/g, '')}`;

    // 2. Provision Database (Create DB)
    await this.provisionDatabase(dbName);

    // 3. Migrate Database (Schema Create/Migrate)
    const dbUrl = await this.migrateTenantDatabase(dbName);

    // 4. Create Tenant Record
    const tenant = new Tenant();
    tenant.name = dto.name;
    tenant.code = dto.code;
    tenant.databaseUrl = dbUrl;

    await this.em.persist(tenant).flush();

    return tenant;
  }

  private async provisionDatabase(dbName: string): Promise<void> {
    const dbFolder = this.getDbFolder();
    const dbPath = path.join(dbFolder, `${dbName}.db`);
    this.logger.log(`Provisioning database (SQLite file): ${dbPath}`);

    // Clean up stale database if it exists (e.g. from failed previous attempts)
    if (fs.existsSync(dbPath)) {
      this.logger.warn(`Removing existing database file: ${dbPath}`);
      try {
        fs.unlinkSync(dbPath);
      } catch (err) {
        this.logger.error(
          `Failed to delete existing database file: ${err.message}`,
        );
        // We throw because if we can't delete it, we'll likely fail to create/migrate correctly if state is bad
        throw new InternalServerErrorException(
          `Failed to clean up key collision/stale database: ${dbPath}`,
        );
      }
    }
  }

  private async migrateTenantDatabase(dbName: string): Promise<string> {
    this.logger.log(`Migrating database: ${dbName}`);

    // For SQLite, the "URL" is just the database file name/path
    // We'll append .db to ensure clarity
    const tenantDbName = `${dbName}.db`;
    const dbFolder = this.getDbFolder();
    const dbPath = path.join(dbFolder, tenantDbName);

    let tenantOrm: MikroORM | undefined;
    try {
      // Initialize a temporary ORM for the new tenant DB
      // Locate entities from apps/api
      const isMonorepoRoot = fs.existsSync(
        path.join(process.cwd(), 'apps/api'),
      );

      // Points to compiled JS files for execution
      const entitiesGlob = isMonorepoRoot
        ? 'apps/api/dist/**/*.entity.js'
        : '../api/dist/**/*.entity.js';

      // Points to source TS files for metadata discovery (via TsMorphMetadataProvider)
      const entitiesTsGlob = isMonorepoRoot
        ? 'apps/api/src/**/*.entity.ts'
        : '../api/src/**/*.entity.ts';

      const entitiesPath = path
        .join(process.cwd(), entitiesGlob)
        .replace(/\\/g, '/');
      const entitiesTsPath = path
        .join(process.cwd(), entitiesTsGlob)
        .replace(/\\/g, '/');

      this.logger.log(`Loading entities from: ${entitiesPath}`);

      // Initialize a temporary ORM for the new tenant DB
      tenantOrm = await MikroORM.init({
        dbName: dbPath,
        driver: SqliteDriver,
        entities: [entitiesPath],
        entitiesTs: [entitiesTsPath],
        metadataProvider: TsMorphMetadataProvider,
        allowGlobalContext: true, // needed for standalone usage
      });

      const schemaGenerator = tenantOrm.schema;
      await schemaGenerator.updateSchema(); // or .createSchema() if we want fresh
      // Alternatively, use migrator if migrations are preferred:
      // const migrator = tenantOrm.getMigrator();
      // await migrator.up();

      this.logger.log(`Schema applied to ${dbPath}`);

      return dbPath;
    } catch (error) {
      this.logger.error(`Failed to migrate tenant database ${dbName}`, error);
      throw new InternalServerErrorException(
        `Failed to migrate database: ${error.message}`,
      );
    } finally {
      if (tenantOrm) {
        await tenantOrm.close(true);
      }
    }
  }

  private getDbFolder(): string {
    const possiblePaths = [
      path.join(process.cwd(), 'apps/admin/src/common/libs/database'),
      path.join(process.cwd(), 'src/common/libs/database'),
    ];
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }
    // Default to the first path if neither exists (will likely fail later, but valid for path construction)
    return possiblePaths[0];
  }
}
