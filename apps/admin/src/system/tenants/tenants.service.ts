import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { EntityManager, MikroORM } from '@mikro-orm/core';
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
    this.logger.log(`Provisioning database: ${dbName}`);
    try {
      // Must use a separate connection or ensuring we are not in a transaction for CREATE DATABASE
      // Using the current EM's connection to execute raw SQL.
      // Note: CREATE DATABASE cannot run inside a transaction block.
      // We assume the upstream caller hasn't started a transaction, or we fork.

      const checkDb = await this.em
        .getConnection()
        .execute(`SELECT 1 FROM pg_database WHERE datname = ?`, [dbName]);

      if (checkDb && checkDb.length > 0) {
        this.logger.warn(
          `Database ${dbName} already exists, skipping creation.`,
        );
        return;
      }

      await this.em.getConnection().execute(`CREATE DATABASE "${dbName}"`);
      this.logger.log(`Database ${dbName} created successfully.`);
    } catch (error) {
      this.logger.error(`Failed to create database ${dbName}`, error);
      throw new InternalServerErrorException(
        `Failed to provision database: ${error.message}`,
      );
    }
  }

  private async migrateTenantDatabase(dbName: string): Promise<string> {
    this.logger.log(`Migrating database: ${dbName}`);

    // Construct the connection URL for the new tenant DB
    // We assume the system DB URL is available and we can swap the database name
    const systemDbUrl =
      process.env.SYSTEM_DATABASE_URL || process.env.DATABASE_URL;
    console.log(
      '🚀 ~ TenantsService ~ migrateTenantDatabase ~ systemDbUrl:',
      systemDbUrl,
    );
    if (!systemDbUrl) {
      throw new InternalServerErrorException(
        'System database URL not configured',
      );
    }

    // Replace the database name in the URL (assuming standard postgres://user:pass@host:port/dbname format)
    const tenantDbUrl = systemDbUrl.replace(/\/[^/?]+(\?.*)?$/, `/${dbName}$1`);
    console.log(
      '🚀 ~ TenantsService ~ migrateTenantDatabase ~ tenantDbUrl:',
      tenantDbUrl,
    );

    let tenantOrm: MikroORM | undefined;
    try {
      // Initialize a temporary ORM for the new tenant DB
      tenantOrm = await MikroORM.init({
        ...
        clientUrl: tenantDbUrl,
        allowGlobalContext: true, // needed for standalone usage
      });
      console.log(
        '🚀 ~ TenantsService ~ migrateTenantDatabase ~ tenantOrm:',
        tenantOrm,
      );

      const schemaGenerator = tenantOrm.schema;
      await schemaGenerator.updateSchema(); // or .createSchema() if we want fresh
      // Alternatively, use migrator if migrations are preferred:
      // const migrator = tenantOrm.getMigrator();
      // await migrator.up();

      this.logger.log(`Schema applied to ${dbName}`);
      return tenantDbUrl;
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
}
