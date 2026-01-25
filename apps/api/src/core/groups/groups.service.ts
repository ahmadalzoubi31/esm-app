import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Group } from './entities/group.entity';
import { EntityRepository } from '@mikro-orm/core';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: EntityRepository<Group>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    // Create a group
    const { businessLineId, teamLeaderId, ...rest } = createGroupDto;

    const group = this.groupRepository.create({
      ...rest,
      businessLine: businessLineId as any,
      teamLeader: teamLeaderId as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // Save a group
    await this.groupRepository.getEntityManager().persist(group).flush();
    return group;
  }

  async findAll({ where }: { where?: any }): Promise<Group[]> {
    return await this.groupRepository.find(where || {});
  }

  async findOne(id: string): Promise<Group | null> {
    return await this.groupRepository.findOne({ id });
  }

  async update(id: string, dto: UpdateGroupDto): Promise<Group> {
    const group = await this.groupRepository.findOneOrFail({ id });
    this.groupRepository.assign(group, dto);
    await this.groupRepository.getEntityManager().flush();
    return group;
  }

  async remove(id: string): Promise<void> {
    await this.groupRepository.nativeDelete({ id });
  }
}
