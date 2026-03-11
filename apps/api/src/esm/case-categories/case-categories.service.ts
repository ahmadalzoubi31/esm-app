import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { CaseCategory } from './entities/case-category.entity';
import { CreateCaseCategoryDto } from './dto/create-case-category.dto';
import { UpdateCaseCategoryDto } from './dto/update-case-category.dto';
import { Tenant } from 'src/tenants/entities/tenant.entity';

@Injectable()
export class CaseCategoriesService {
  constructor(
    @InjectRepository(CaseCategory)
    private readonly categoryRepo: EntityRepository<CaseCategory>,
  ) {}

  async create(createDto: CreateCaseCategoryDto): Promise<CaseCategory> {
    // 1: Get EntityManager
    const em = this.categoryRepo.getEntityManager();

    // 2: Get Tenant ID from Filter
    const tenantFilter = em.getFilterParams('tenant');

    // 3: Get Tenant Reference
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    // 4: Create Category
    const category = this.categoryRepo.create({
      ...createDto,
      tenant: tenantRef,
    });

    // 5: Persist and Flush
    await this.categoryRepo.getEntityManager().persistAndFlush(category);

    return category;
  }

  async findAll(): Promise<CaseCategory[]> {
    return this.categoryRepo.findAll();
  }

  async findOne(id: string): Promise<CaseCategory> {
    const category = await this.categoryRepo.findOne({ id });
    if (!category) {
      throw new NotFoundException(`Case Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateDto: UpdateCaseCategoryDto,
  ): Promise<CaseCategory> {
    // 1: Find Category
    const category = await this.findOne(id);

    // 2: Assign Category
    this.categoryRepo.assign(category, updateDto);

    // 3: Persist and Flush
    await this.categoryRepo.getEntityManager().flush();

    return category;
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepo.getEntityManager().removeAndFlush(category);
  }
}
