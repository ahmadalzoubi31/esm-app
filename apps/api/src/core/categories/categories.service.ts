import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Tenant } from 'src/tenants/entities/tenant.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,
  ) {}

  async create(createDto: CreateCategoryDto): Promise<Category> {
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

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.findAll({ populate: ['subcategories'] });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepo.findOne({ id }, { populate: ['subcategories'] });
    if (!category) {
      throw new NotFoundException(`category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, updateDto: UpdateCategoryDto): Promise<Category> {
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
