import { Injectable } from '@nestjs/common';
import { CreateBusinessLineDto } from './dto/create-business-line.dto';
import { UpdateBusinessLineDto } from './dto/update-business-line.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BusinessLine } from './entities/business-line.entity';
import { EntityRepository, RequiredEntityData } from '@mikro-orm/core';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Injectable()
export class BusinessLineService {
  constructor(
    @InjectRepository(BusinessLine)
    private readonly businessLineRepository: EntityRepository<BusinessLine>,
  ) {}

  async create(
    createBusinessLineDto: CreateBusinessLineDto,
  ): Promise<BusinessLine> {
    // 1: Get EntityManager
    const em = this.businessLineRepository.getEntityManager();

    // 2: Get Tenant ID from Filter
    const tenantFilter = em.getFilterParams('tenant');

    // 3: Get Tenant Reference
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    // create business line
    const businessLine = this.businessLineRepository.create({
      ...createBusinessLineDto,
      active: true,
      tenant: tenantRef,
    });
    // save business line
    await this.businessLineRepository
      .getEntityManager()
      .persist(businessLine)
      .flush();
    return businessLine;
  }

  async findAll({ where }: { where?: any }): Promise<BusinessLine[]> {
    return await this.businessLineRepository.find(where || {});
  }

  async findOne(id: string): Promise<BusinessLine | null> {
    return await this.businessLineRepository.findOne({ id });
  }

  async update(
    id: string,
    updateBusinessLineDto: UpdateBusinessLineDto,
  ): Promise<BusinessLine> {
    const businessLine = await this.businessLineRepository.findOneOrFail({
      id,
    });
    this.businessLineRepository.assign(businessLine, updateBusinessLineDto);
    await this.businessLineRepository.getEntityManager().flush();
    return businessLine;
  }

  async remove(id: string): Promise<void> {
    await this.businessLineRepository.nativeDelete({ id });
  }
}
