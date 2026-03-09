import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Group } from './entities/group.entity';
import { EntityRepository } from '@mikro-orm/core';
import { Tenant } from 'src/tenants/entities/tenant.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { User } from '../users/entities/user.entity';
@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: EntityRepository<Group>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const em = this.groupRepository.getEntityManager();
    const tenantFilter = em.getFilterParams('tenant');
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    const { businessLineId, teamLeaderId, roles, permissions, users, ...rest } =
      createGroupDto;

    const group = this.groupRepository.create({
      ...rest,
      businessLine: businessLineId as any,
      teamLeader: teamLeaderId as any,
      tenant: tenantRef,
    });

    if (roles && roles.length > 0) {
      const roleRefs = roles.map((roleId) => em.getReference(Role, roleId));
      group.roles.set(roleRefs);
    }

    if (permissions && permissions.length > 0) {
      const permRefs = permissions.map((permId) =>
        em.getReference(Permission, permId),
      );
      group.permissions.set(permRefs);
    }

    if (users && users.length > 0) {
      const userRefs = users.map((userId) => em.getReference(User, userId));
      group.users.set(userRefs);
    }

    await em.persist(group).flush();
    return group;
  }

  async findAll({ where }: { where?: any }): Promise<Group[]> {
    return await this.groupRepository.find(where || {}, {
      populate: ['roles', 'permissions', 'users', 'teamLeader'],
      filters: { tenant: false },
    });
  }

  async findOne(id: string): Promise<Group | null> {
    return await this.groupRepository.findOne(
      { id },
      {
        populate: ['roles', 'permissions', 'users', 'teamLeader'],
        filters: { tenant: false },
      },
    );
  }

  async update(id: string, dto: UpdateGroupDto): Promise<Group> {
    const group = await this.groupRepository.findOneOrFail(
      { id },
      {
        populate: ['roles', 'permissions', 'users'],
        filters: { tenant: false },
      },
    );

    const em = this.groupRepository.getEntityManager();
    const { roles, permissions, users, teamLeaderId, ...rest } = dto;

    if (teamLeaderId !== undefined) {
      rest['teamLeader'] = teamLeaderId as any;
    }

    if (roles !== undefined) {
      if (roles.length > 0) {
        const roleRefs = roles.map((roleId) => em.getReference(Role, roleId));
        group.roles.set(roleRefs);
      } else {
        group.roles.removeAll();
      }
    }

    if (permissions !== undefined) {
      if (permissions.length > 0) {
        const permRefs = permissions.map((permId) =>
          em.getReference(Permission, permId),
        );
        group.permissions.set(permRefs);
      } else {
        group.permissions.removeAll();
      }
    }

    if (users !== undefined) {
      if (users.length > 0) {
        const userRefs = users.map((userId) => em.getReference(User, userId));
        group.users.set(userRefs);
      } else {
        group.users.removeAll();
      }
    }

    this.groupRepository.assign(group, rest);
    await em.flush();
    return group;
  }

  async remove(id: string): Promise<void> {
    await this.groupRepository.nativeDelete({ id });
  }

  async deleteBulk(ids: string[]): Promise<number> {
    return await this.groupRepository.nativeDelete({ id: { $in: ids } });
  }
}
