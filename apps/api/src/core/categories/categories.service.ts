import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Tenant } from '../../tenants/entities/tenant.entity';

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

    // 4: Map DTO to Entity data
    // Create new dto without parentId, map parentId to parent reference
    const { parentId, ...rest } = createDto;

    // 5: Create Category
    const category = this.categoryRepo.create({
      ...rest,
      tier: rest.tier ?? 1,
      tenant: tenantRef,
      ...(parentId ? { parent: parentId } : {}),
    });

    // 6: Persist and Flush
    await this.categoryRepo.getEntityManager().persistAndFlush(category);

    return category;
  }

  async findAll(tier?: number, parentId?: string): Promise<Category[]> {
    const where: any = {};
    if (tier !== undefined) {
      where.tier = tier;
    }
    if (parentId !== undefined) {
      where.parent = parentId;
    }
    return this.categoryRepo.find(where, { populate: ['children', 'parent'] });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepo.findOne(
      { id },
      { populate: ['children', 'parent'] },
    );
    if (!category) {
      throw new NotFoundException(`category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, updateDto: UpdateCategoryDto): Promise<Category> {
    // 1: Find Category
    const category = await this.findOne(id);

    // 2: Map parentId to parent if needed
    const { parentId, ...rest } = updateDto as any;
    const updates: any = { ...rest };
    if (parentId !== undefined) {
      updates.parent = parentId;
    }

    // 3: Assign Category
    this.categoryRepo.assign(category, updates);

    // 4: Persist and Flush
    await this.categoryRepo.getEntityManager().flush();

    return category;
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepo.getEntityManager().removeAndFlush(category);
  }
}
