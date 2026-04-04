import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { ServiceCard } from './entities/service-card.entity';
import { CreateServiceCardDto } from './dto/create-service-card.dto';
import { UpdateServiceCardDto } from './dto/update-service-card.dto';

@Injectable()
export class ServiceCardsService {
  constructor(
    @InjectRepository(ServiceCard)
    private readonly repo: EntityRepository<ServiceCard>,
  ) {}

  async create(dto: CreateServiceCardDto): Promise<ServiceCard> {
    const em = this.repo.getEntityManager();
    const card = this.repo.create(dto);
    await em.persist(card).flush();
    return card;
  }

  async findAll(): Promise<ServiceCard[]> {
    return this.repo.find(
      {},
      {
        populate: ['formSchemas'],
        orderBy: { displayOrder: QueryOrder.ASC, displayTitle: QueryOrder.ASC },
      },
    );
  }

  async findOne(id: string): Promise<ServiceCard> {
    const card = await this.repo.findOne({ id }, { populate: ['formSchemas'] });
    if (!card) throw new NotFoundException(`ServiceCard ${id} not found`);
    return card;
  }

  async update(id: string, dto: UpdateServiceCardDto): Promise<ServiceCard> {
    const card = await this.findOne(id);
    this.repo.assign(card, dto);
    await this.repo.getEntityManager().flush();
    return card;
  }

  async remove(id: string): Promise<void> {
    await this.repo.nativeDelete({ id });
  }
}
