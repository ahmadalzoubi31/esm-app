import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { Category } from './entities/category.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: EntityRepository<Category>,
  ) {}

  // --- CRUD Operations ---

  async create(dto: CreateCategoryDto): Promise<Category> {
    const em = this.repo.getEntityManager();

    // 1. Safe Tenant Handling
    const tenantFilter = em.getFilterParams('tenant');
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    // 2. Validate parent id
    if (dto.parentId) {
      const parent = await this.findOne(dto.parentId);
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    // 2. Create and persist
    const category = this.repo.create({
      ...dto,
      tenant: tenantRef,
    });
    await em.persist(category).flush();
    return category;
  }

  async findAll(where: any = {}): Promise<Category[]> {
    return this.repo.find(where, { orderBy: { name: QueryOrder.ASC } });
  }

  async findOne(id: string): Promise<Category> {
    // Standardizing on findOneOrFail for consistent 404 behavior
    return this.repo.findOneOrFail({ id });
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    this.repo.assign(category, dto);
    await this.repo.getEntityManager().flush();
    return category;
  }

  async remove(id: string): Promise<void> {
    await this.repo.nativeDelete({ id });
  }

  async deleteBulk(ids: string[]): Promise<number> {
    return this.repo.nativeDelete({ id: { $in: ids } });
  }
}
