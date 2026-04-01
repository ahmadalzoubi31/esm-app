import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityRepository,
  QueryOrder,
  RequiredEntityData,
} from '@mikro-orm/core';
import { Group } from './entities/group.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { User } from '../users/entities/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: EntityRepository<Group>,
  ) {}

  async create(dto: CreateGroupDto): Promise<Group> {
    const em = this.groupRepo.getEntityManager();

    // 1. Safe Tenant Handling
    const tenantFilter = em.getFilterParams('tenant');
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    // 2. Create and persist
    const group = this.groupRepo.create({
      ...dto,
      businessLine: dto.businessLineId,
      tenant: tenantRef,
    });
    await em.persist(group).flush();

    // 3. Handle Collections via .set()
    if (dto.roleIds?.length) {
      group.roles.set(dto.roleIds.map((id) => em.getReference(Role, id)));
    }
    if (dto.permissionIds?.length) {
      group.permissions.set(
        dto.permissionIds.map((id) => em.getReference(Permission, id)),
      );
    }
    if (dto.memberIds?.length) {
      group.members.set(dto.memberIds.map((id) => em.getReference(User, id)));
    }

    await em.persist(group).flush();
    return group;
  }

  async findAll({ where }: { where?: Record<string, unknown> } = {}): Promise<
    Group[]
  > {
    return this.groupRepo.find(where || {}, {
      filters: { tenant: false },
      orderBy: { name: QueryOrder.ASC },
    });
  }

  async findOne(id: string): Promise<Group> {
    return this.groupRepo.findOneOrFail(
      { id },
      {
        filters: { tenant: false },
      },
    );
  }

  async update(id: string, dto: UpdateGroupDto): Promise<Group> {
    const group = await this.findOne(id);
    const em = this.groupRepo.getEntityManager();
    const { roleIds, permissionIds, memberIds, ...rest } = dto;

    // 1. Update basic fields & ID references
    this.groupRepo.assign(group, rest);

    // 2. Sync Collections
    if (roleIds !== undefined) {
      group.roles.set(roleIds.map((id) => em.getReference(Role, id)));
    }

    if (permissionIds !== undefined) {
      group.permissions.set(
        permissionIds.map((id) => em.getReference(Permission, id)),
      );
    }

    if (memberIds !== undefined) {
      group.members.set(memberIds.map((id) => em.getReference(User, id)));
    }

    await em.flush();
    return group;
  }

  async remove(id: string): Promise<void> {
    await this.groupRepo.nativeDelete({ id });
  }

  async deleteBulk(ids: string[]): Promise<number> {
    return this.groupRepo.nativeDelete({ id: { $in: ids } });
  }
}
