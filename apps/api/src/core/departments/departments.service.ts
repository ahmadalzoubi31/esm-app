import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityRepository,
  QueryOrder,
  RequiredEntityData,
} from '@mikro-orm/core';
import { Department } from './entities/department.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly repo: EntityRepository<Department>,
  ) {}

  // --- CRUD Operations ---

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const em = this.repo.getEntityManager();

    // 1. Safe Tenant Handling
    const tenantFilter = em.getFilterParams('tenant');
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    // 2. Create base user (Collections are initialized as empty by MikroORM)
    const department = this.repo.create({
      ...dto,
      tenant: tenantRef,
    });
    await em.persist(department).flush();
    return department;
  }

  async findAll(where: any = {}): Promise<Department[]> {
    return this.repo.find(where, { orderBy: { name: QueryOrder.ASC } });
  }

  async findOne(id: string): Promise<Department> {
    // findOneOrFail handles the NotFoundException automatically
    return this.repo.findOneOrFail({ id });
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findOne(id);
    this.repo.assign(department, dto);
    await this.repo.getEntityManager().flush();
    return department;
  }

  async remove(id: string): Promise<void> {
    await this.repo.nativeDelete({ id });
  }

  async deleteBulk(ids: string[]): Promise<number> {
    return this.repo.nativeDelete({ id: { $in: ids } });
  }
}
