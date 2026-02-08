import {
  Injectable,
  Logger,
  OnModuleDestroy,
  NotFoundException,
} from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Tenant } from '../core/system/tenant.entity';
import { tenantOrmBaseOptions } from '../config/tenant-database.options';

@Injectable()
export class TenantOrmService implements OnModuleDestroy {
  private readonly logger = new Logger(TenantOrmService.name);
  private readonly instances = new Map<string, MikroORM>();

  constructor(private readonly systemEm: EntityManager) {}

  async getOrm(tenantCode: string): Promise<MikroORM> {
    if (this.instances.has(tenantCode)) {
      return this.instances.get(tenantCode)!;
    }

    const tenant = await this.systemEm.findOne(Tenant, { code: tenantCode });
    if (!tenant) {
      throw new NotFoundException(`Tenant ${tenantCode} not found`);
    }

    this.logger.log(
      `Initializing ORM for tenant: ${tenantCode} (${tenant.databaseUrl})`,
    );

    // Ensure database URL is correct for the environment
    const dbUrl = tenant.databaseUrl;

    const orm = await MikroORM.init({
      ...tenantOrmBaseOptions,
      clientUrl: dbUrl,
    });

    this.instances.set(tenantCode, orm);
    return orm;
  }

  async onModuleDestroy() {
    for (const [code, orm] of this.instances) {
      this.logger.log(`Closing ORM for tenant: ${code}`);
      await orm.close();
    }
    this.instances.clear();
  }
}
