import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Subcategory } from './entities/subcategory.entity';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Tenant } from 'src/tenants/entities/tenant.entity';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoryRepo: EntityRepository<Subcategory>,
  ) {}

  async create(createDto: CreateSubcategoryDto): Promise<Subcategory> {
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

  async findAll(categoryId?: string): Promise<Subcategory[]> {
    const where: any = {};
    if (categoryId) {
      where.category = categoryId;
    }
    return this.subcategoryRepo.find(where, { populate: ['category'] });
  }

  async findOne(id: string): Promise<Subcategory> {
    const subcategory = await this.subcategoryRepo.findOne(
      { id },
      { populate: ['category'] },
    );
    if (!subcategory) {
      throw new NotFoundException(`Subcategory with ID ${id} not found`);
    }
    return subcategory;
  }

  async update(
    id: string,
    updateDto: UpdateSubcategoryDto,
  ): Promise<Subcategory> {
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
