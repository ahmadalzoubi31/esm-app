import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Group } from './entities/group.entity';
import { EntityRepository } from '@mikro-orm/core';
import { Tenant } from '../../tenants/entities/tenant.entity';
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
    // 1: Get EntityManager
    const em = this.groupRepository.getEntityManager();

    // 2: Get Tenant ID from Filter
    const tenantFilter = em.getFilterParams('tenant');

    // 3: Get Tenant Reference
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    // 4: Destructure createGroupDto
    const {
      businessLineId,
      teamLeaderId,
      departmentId,
      roles,
      permissions,
      users,
      ...rest
    } = createGroupDto;

    // 5: Create group and set references
    const group = this.groupRepository.create({
      ...rest,
      businessLine: businessLineId,
      teamLeader: teamLeaderId as string,
      department: departmentId as string,
      tenant: tenantRef,
    });

    // 6: Assign roles if present
    if (roles && roles.length > 0) {
      const roleRefs = roles.map((roleId) => em.getReference(Role, roleId));
      group.roles.set(roleRefs);
    }

    // 7: Assign permissions if present
    if (permissions && permissions.length > 0) {
      const permRefs = permissions.map((permId) =>
        em.getReference(Permission, permId),
      );
      group.permissions.set(permRefs);
    }

    // 8: Assign users if present
    if (users && users.length > 0) {
      const userRefs = users.map((userId) => em.getReference(User, userId));
      group.users.set(userRefs);
    }

    // 9: Save group
    await em.persist(group).flush();

    // 10: Return group
    return group;
  }

  async findAll({ where }: { where?: any }): Promise<Group[]> {
    // 1: Find all groups with populate and filters
    return await this.groupRepository.find(where || {}, {
      populate: [
        'roles',
        'permissions',
        'users',
        'teamLeader',
        'businessLine',
        'department',
      ],
      filters: { tenant: false },
    });
  }

  async findOne(id: string): Promise<Group | null> {
    // 1: Find group by id with populate and filters
    return await this.groupRepository.findOne(
      { id },
      {
        populate: [
          'roles',
          'permissions',
          'users',
          'teamLeader',
          'businessLine',
          'department',
        ],
        filters: { tenant: false },
      },
    );
  }

  async update(id: string, dto: UpdateGroupDto): Promise<Group> {
    // 1: Find group by id with populate and filters
    const group = await this.groupRepository.findOneOrFail(
      { id },
      {
        populate: [
          'roles',
          'permissions',
          'users',
          'teamLeader',
          'businessLine',
          'department',
        ],
        filters: { tenant: false },
      },
    );

    // 2: Get EntityManager
    const em = this.groupRepository.getEntityManager();

    // 3: Destructure updateGroupDto
    const { roles, permissions, users, teamLeaderId, departmentId, ...rest } =
      dto;

    // 4: Update teamLeader if present
    if (teamLeaderId !== undefined) {
      rest['teamLeader'] = teamLeaderId as any;
    }

    // 5: Update department if present
    if (departmentId !== undefined) {
      rest['department'] = departmentId as any;
    }

    // 6: Update roles if present
    if (roles !== undefined) {
      if (roles.length > 0) {
        const roleRefs = roles.map((roleId) => em.getReference(Role, roleId));
        group.roles.set(roleRefs);
      } else {
        group.roles.removeAll();
      }
    }

    // 7: Update permissions if present
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
    // 8: Update users if present
    if (users !== undefined) {
      if (users.length > 0) {
        const userRefs = users.map((userId) => em.getReference(User, userId));
        group.users.set(userRefs);
      } else {
        group.users.removeAll();
      }
    }

    // 9: Assign the rest of the properties
    this.groupRepository.assign(group, rest);
    // 10: Save group
    await em.flush();
    // 11: Return group
    return group;
  }

  async remove(id: string): Promise<void> {
    // 1: Remove group by id
    await this.groupRepository.nativeDelete({ id });
  }

  async deleteBulk(ids: string[]): Promise<number> {
    // 1: Remove groups by ids
    return await this.groupRepository.nativeDelete({ id: { $in: ids } });
  }
}
