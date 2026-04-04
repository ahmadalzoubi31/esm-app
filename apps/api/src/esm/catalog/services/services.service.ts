import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly repo: EntityRepository<Service>,
  ) {}

  async create(dto: CreateServiceDto): Promise<Service> {
    const em = this.repo.getEntityManager();
    const service = this.repo.create(dto);
    await em.persist(service).flush();
    return service;
  }

  async findAll(): Promise<Service[]> {
    return this.repo.find({}, { orderBy: { name: QueryOrder.ASC } });
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.repo.findOne({ id });
    if (!service) throw new NotFoundException(`Service ${id} not found`);
    return service;
  }

  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);
    this.repo.assign(service, dto);
    await this.repo.getEntityManager().flush();
    return service;
  }

  async remove(id: string): Promise<void> {
    await this.repo.nativeDelete({ id });
  }
}
