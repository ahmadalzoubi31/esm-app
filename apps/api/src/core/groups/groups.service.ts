import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Group } from './entities/group.entity';
import { EntityRepository } from '@mikro-orm/core';
import { Tenant } from 'src/tenants/entities/tenant.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: EntityRepository<Group>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    // 1: Get EntityManager
    const em = this.groupRepository.getEntityManager();

    // 2: Get Tenant ID from Filter
    const tenantFilter = em.getFilterParams('tenant');

    // 3: Get Tenant Reference
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    const { businessLineId, teamLeaderId, ...rest } = createGroupDto;

    const group = this.groupRepository.create({
      ...rest,
      businessLine: businessLineId as any,
      teamLeader: teamLeaderId as any,
      tenant: tenantRef,
    });
    // Save a group
    await this.groupRepository.getEntityManager().persist(group).flush();
    return group;
  }

  async findAll({ where }: { where?: any }): Promise<Group[]> {
    return await this.groupRepository.find(where || {}, {
      filters: { tenant: false },
    });
  }

  async findOne(id: string): Promise<Group | null> {
    return await this.groupRepository.findOne(
      { id },
      {
        filters: { tenant: false },
      },
    );
  }

  async update(id: string, dto: UpdateGroupDto): Promise<Group> {
    const group = await this.groupRepository.findOneOrFail(
      { id },
      {
        filters: { tenant: false },
      },
    );
    this.groupRepository.assign(group, dto);
    await this.groupRepository.getEntityManager().flush();
    return group;
  }

  async remove(id: string): Promise<void> {
    await this.groupRepository.nativeDelete({ id });
  }
}
