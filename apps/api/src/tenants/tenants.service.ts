import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantsService {
  constructor(private readonly em: EntityManager) {}

  async create(createTenantDto: CreateTenantDto) {
    const tenant = this.em.create(Tenant, createTenantDto);
    this.em.persist(tenant); // Persist first, flush later

    // Import needed dynamically to avoid circular issues or just at top level.
    const { User } = await import('../core/users/entities/user.entity');
    const { randomBytes } = await import('crypto');
    const { AuthSource } =
      await import('../core/users/constants/auth-source.constant');

    const rawPassword = randomBytes(8).toString('hex');

    const activationUser = this.em.create(User, {
      username: `admin@${tenant.slug}`,
      email: `admin@${tenant.slug}.local`,
      firstName: 'Activation',
      lastName: 'User',
      authSource: AuthSource.LOCAL,
      isActive: true,
      isLicensed: true,
      password: rawPassword,
      tenant: tenant,
    });

    tenant.preferences = tenant.preferences || {};
    tenant.preferences.activationCredentials = {
      username: activationUser.username,
      password: rawPassword,
    };

    this.em.persist(activationUser);

    // Flush both tenant and activation user changes together
    await this.em.flush();

    return {
      ...tenant,
      activationCredentials: {
        username: activationUser.username,
        password: rawPassword,
      },
    };
  }

  findAll() {
    return this.em.find(Tenant, {});
  }

  findOne(id: string) {
    return this.em.findOneOrFail(Tenant, { id });
  }

  async update(id: string, updateTenantDto: UpdateTenantDto) {
    const tenant = await this.em.findOneOrFail(Tenant, { id });
    this.em.assign(tenant, updateTenantDto);
    await this.em.flush();
    return tenant;
  }

  async remove(id: string) {
    const tenant = await this.em.findOneOrFail(Tenant, { id });
    await this.em.removeAndFlush(tenant);
    return { success: true };
  }
}
