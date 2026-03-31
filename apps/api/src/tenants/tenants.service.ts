import { Injectable } from '@nestjs/common';
import { EntityManager, RequiredEntityData } from '@mikro-orm/core';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './entities/tenant.entity';
import { randomBytes } from 'crypto';
import { User } from '../core/users/entities/user.entity';
import { AuthSourceEnum } from '@repo/shared';

@Injectable()
export class TenantsService {
  constructor(private readonly em: EntityManager) {}

  async create(dto: CreateTenantDto) {
    // 1. Create the Tenant first
    const tenant = this.em.create(Tenant, dto as RequiredEntityData<Tenant>);
    this.em.persist(tenant);

    const rawPassword = randomBytes(8).toString('hex');

    // 3. Create the Activation User
    const activationUser = this.em.create(User, {
      username: `admin@${tenant.slug}`,
      email: `admin@${tenant.slug}.local`,
      firstName: 'Activation',
      lastName: 'User',
      authSource: AuthSourceEnum.local,
      isActive: true,
      isLicensed: true,
      password: rawPassword,
      tenant: tenant,
    } as any); // Using 'as any' here only because User is dynamically imported and TS can't verify the shape

    // 4. Update tenant preferences
    tenant.preferences = {
      ...(tenant.preferences || {}),
      activationCredentials: {
        username: activationUser.username,
        password: rawPassword,
      },
    };

    this.em.persist(activationUser);

    // 5. Atomic flush for both entities
    await this.em.flush();

    return {
      ...tenant,
      activationCredentials: {
        username: activationUser.username,
        password: rawPassword,
      },
    };
  }

  async findAll(): Promise<Tenant[]> {
    return this.em.find(Tenant, {});
  }

  async findOne(id: string): Promise<Tenant> {
    return this.em.findOneOrFail(Tenant, { id });
  }

  async update(id: string, dto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);
    this.em.assign(tenant, dto);
    await this.em.flush();
    return tenant;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const tenant = await this.findOne(id);
    await this.em.removeAndFlush(tenant);
    return { success: true };
  }
}
