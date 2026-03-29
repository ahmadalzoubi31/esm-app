import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Department } from './entities/department.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: EntityRepository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    // 1: Get EntityManager
    const em = this.departmentRepository.getEntityManager();
    // 2: Get Tenant ID from Filter
    const tenantFilter = em.getFilterParams('tenant');
    // 3: Get Tenant Reference
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    // 4: Create department and set references
    const department = this.departmentRepository.create({
      key: '', // because it auto generate on DB level
      ...createDepartmentDto,
      tenant: tenantRef,
    });

    // 5: Save department
    await em.persist(department).flush();
    return department;
  }

  async findAll({ where }: { where?: any } = {}): Promise<Department[]> {
    // 1: Find all departments with populate and filters
    return await this.departmentRepository.find(where || {});
  }

  async findOne(id: string): Promise<Department | null> {
    // 1: Find department by id
    return await this.departmentRepository.findOne({ id });
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    // 1: Find department by id
    const department = await this.departmentRepository.findOneOrFail({ id });
    // 2: Update department
    this.departmentRepository.assign(department, dto);
    // 3: Save department
    await this.departmentRepository.getEntityManager().flush();
    // 4: Return department
    return department;
  }

  async remove(id: string): Promise<void> {
    // 1: Remove department by id
    await this.departmentRepository.nativeDelete({ id });
  }

  async deleteBulk(ids: string[]): Promise<number> {
    // 1: Remove departments by ids
    return await this.departmentRepository.nativeDelete({ id: { $in: ids } });
  }
}
