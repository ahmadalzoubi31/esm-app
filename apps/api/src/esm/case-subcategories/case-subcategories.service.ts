import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { CaseSubcategory } from './entities/case-subcategory.entity';
import { CreateCaseSubcategoryDto } from './dto/create-case-subcategory.dto';
import { UpdateCaseSubcategoryDto } from './dto/update-case-subcategory.dto';
import { Tenant } from 'src/tenants/entities/tenant.entity';

@Injectable()
export class CaseSubcategoriesService {
  constructor(
    @InjectRepository(CaseSubcategory)
    private readonly subcategoryRepo: EntityRepository<CaseSubcategory>,
  ) {}

  async create(createDto: CreateCaseSubcategoryDto): Promise<CaseSubcategory> {
    // 1: Get EntityManager
    const em = this.subcategoryRepo.getEntityManager();

    // 2: Get Tenant ID from Filter
    const tenantFilter = em.getFilterParams('tenant');

    // 3: Get Tenant Reference
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    const subcategory = this.subcategoryRepo.create({
      ...createDto,
      category: createDto.categoryId as string,
      tenant: tenantRef,
    });

    await this.subcategoryRepo.getEntityManager().persistAndFlush(subcategory);
    return subcategory;
  }

  async findAll(): Promise<CaseSubcategory[]> {
    return this.subcategoryRepo.findAll({ populate: ['category'] });
  }

  async findOne(id: string): Promise<CaseSubcategory> {
    const subcategory = await this.subcategoryRepo.findOne(
      { id },
      { populate: ['category'] },
    );
    if (!subcategory) {
      throw new NotFoundException(`Case Subcategory with ID ${id} not found`);
    }
    return subcategory;
  }

  async update(
    id: string,
    updateDto: UpdateCaseSubcategoryDto,
  ): Promise<CaseSubcategory> {
    const subcategory = await this.findOne(id);

    // Explicit mapping if categoryId is updated
    const dataToAssign = { ...updateDto } as any;
    if (updateDto.categoryId) {
      dataToAssign.category = updateDto.categoryId;
      delete dataToAssign.categoryId;
    }

    this.subcategoryRepo.assign(subcategory, dataToAssign);
    await this.subcategoryRepo.getEntityManager().flush();
    return subcategory;
  }

  async remove(id: string): Promise<void> {
    const subcategory = await this.findOne(id);
    await this.subcategoryRepo.getEntityManager().removeAndFlush(subcategory);
  }
}
