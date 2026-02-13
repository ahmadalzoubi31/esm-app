import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { CreateTenantsDto } from './dto/create-tenants.dto';
import { UpdateTenantsDto } from './dto/update-tenants.dto';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantsService {
  constructor(private readonly em: EntityManager) {}

  async create(createTenantsDto: CreateTenantsDto) {
    const tenant = this.em.create(Tenant, createTenantsDto);
    await this.em.persist(tenant).flush();
    return tenant;
  }

  findAll() {
    return this.em.find(Tenant, {});
  }

  findOne(id: string) {
    return this.em.findOneOrFail(Tenant, { id });
  }

  async update(id: string, updateTenantsDto: UpdateTenantsDto) {
    const tenant = await this.em.findOneOrFail(Tenant, { id });
    this.em.assign(tenant, updateTenantsDto);
    await this.em.flush();
    return tenant;
  }

  async remove(id: string) {
    const tenant = await this.em.findOneOrFail(Tenant, { id });
    await this.em.removeAndFlush(tenant);
    return { success: true };
  }
}
