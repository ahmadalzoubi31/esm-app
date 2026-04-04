import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { ServiceCategory } from './entities/service-category.entity';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';

@Injectable()
export class ServiceCategoriesService {
  constructor(
    @InjectRepository(ServiceCategory)
    private readonly repo: EntityRepository<ServiceCategory>,
  ) {}

  async create(dto: CreateServiceCategoryDto): Promise<ServiceCategory> {
    const em = this.repo.getEntityManager();
    const category = this.repo.create({
      name: dto.name,
      description: dto.description,
      parentCategoryId: dto.parentCategoryId,
      parent: dto.parentCategoryId
        ? em.getReference(ServiceCategory, dto.parentCategoryId)
        : undefined,
    });
    await em.persist(category).flush();
    return category;
  }

  async findAll(): Promise<ServiceCategory[]> {
    return this.repo.find(
      {},
      {
        populate: ['children'],
        orderBy: { name: QueryOrder.ASC },
      },
    );
  }

  async findOne(id: string): Promise<ServiceCategory> {
    const category = await this.repo.findOne(
      { id },
      { populate: ['children', 'parent'] },
    );
    if (!category) throw new NotFoundException(`ServiceCategory ${id} not found`);
    return category;
  }

  async update(id: string, dto: UpdateServiceCategoryDto): Promise<ServiceCategory> {
    const category = await this.findOne(id);
    const em = this.repo.getEntityManager();
    this.repo.assign(category, {
      ...dto,
      parent:
        dto.parentCategoryId !== undefined
          ? dto.parentCategoryId
            ? em.getReference(ServiceCategory, dto.parentCategoryId)
            : null
          : undefined,
    });
    await em.flush();
    return category;
  }

  async remove(id: string): Promise<void> {
    await this.repo.nativeDelete({ id });
  }
}
