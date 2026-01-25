import { Injectable } from '@nestjs/common';
import {
  CreateServiceDto,
  ServiceLifecycleStatus,
} from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: EntityRepository<Service>,
  ) {}

  async create(dto: CreateServiceDto): Promise<Service> {
    // 1. Create a new service
    const service = this.serviceRepository.create({
      ...dto,
      code: '',
      lifecycleStatus: dto.lifecycleStatus ?? ServiceLifecycleStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // 2. Save the service
    await this.serviceRepository.getEntityManager().persistAndFlush(service);
    return service;
  }

  async findAll({ where }: { where?: any }): Promise<Service[]> {
    return this.serviceRepository.find(where || {});
  }

  async findOne(id: string): Promise<Service | null> {
    return this.serviceRepository.findOne({ id });
  }

  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.serviceRepository.findOneOrFail({ id });
    this.serviceRepository.assign(service, dto);
    await this.serviceRepository.getEntityManager().flush();
    return service;
  }

  async remove(id: string): Promise<void> {
    await this.serviceRepository.nativeDelete({ id });
  }
}
