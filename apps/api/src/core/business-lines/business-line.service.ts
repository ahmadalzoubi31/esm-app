import { Injectable } from '@nestjs/common';
import { CreateBusinessLineDto } from './dto/create-business-line.dto';
import { UpdateBusinessLineDto } from './dto/update-business-line.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BusinessLine } from './entities/business-line.entity';
import {
  EntityRepository,
  QueryOrder,
  RequiredEntityData,
} from '@mikro-orm/core';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { TenantBaseEntity } from 'src/common/entities/tenant-base.entity';

@Injectable()
export class BusinessLineService {
  constructor(
    @InjectRepository(BusinessLine)
    private readonly repo: EntityRepository<BusinessLine>,
  ) {}

  // --- CRUD Operations ---

  async create(dto: CreateBusinessLineDto): Promise<BusinessLine> {
    const em = this.repo.getEntityManager();

    // 1. Safe Tenant Handling
    const tenantFilter = em.getFilterParams('tenant');
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    // 2. Create and persist
    const businessLine = this.repo.create({
      ...dto,
      tenant: tenantRef,
    });
    await em.persist(businessLine).flush();
    return businessLine;
  }

  async findAll(where: any = {}): Promise<BusinessLine[]> {
    return this.repo.find(where, { orderBy: { name: QueryOrder.ASC } });
  }

  async findOne(id: string): Promise<BusinessLine> {
    // Standardizing on findOneOrFail for consistent 404 behavior
    return this.repo.findOneOrFail({ id });
  }

  async update(id: string, dto: UpdateBusinessLineDto): Promise<BusinessLine> {
    const businessLine = await this.findOne(id);
    this.repo.assign(businessLine, dto);
    await this.repo.getEntityManager().flush();
    return businessLine;
  }

  async remove(id: string): Promise<void> {
    await this.repo.nativeDelete({ id });
  }

  async deleteBulk(ids: string[]): Promise<number> {
    return this.repo.nativeDelete({ id: { $in: ids } });
  }
}
