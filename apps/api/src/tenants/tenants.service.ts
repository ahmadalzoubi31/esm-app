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
    await this.em.persist(tenant).flush();
    return tenant;
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
