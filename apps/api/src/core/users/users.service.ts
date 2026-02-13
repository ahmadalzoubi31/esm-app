import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { Group } from '../groups/entities/group.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    // 1: Get EntityManager
    const em = this.userRepository.getEntityManager();

    // 2: Extract collection fields from DTO
    const { roles, permissions, groups, ...userDataToCreate } = dto;

    // 3: Create user with non-collection fields
    const user = this.userRepository.create({
      ...userDataToCreate,
      tenantId: 'system',
    });

    // 4: Handle roles collection
    if (roles && roles.length > 0) {
      const roleRefs = roles.map((roleId) => em.getReference(Role, roleId));
      user.roles.set(roleRefs);
    }

    // 5: Handle permissions collection
    if (permissions && permissions.length > 0) {
      const permRefs = permissions.map((permId) =>
        em.getReference(Permission, permId),
      );
      user.permissions.set(permRefs);
    }

    // 6: Handle groups collection
    if (groups && groups.length > 0) {
      const groupRefs = groups.map((groupId) =>
        em.getReference(Group, groupId),
      );
      user.groups.set(groupRefs);
    }

    // 7: Save user and return
    await em.persist(user).flush();
    return user;
  }

  async findAll({
    where = {},
    filters,
    search,
  }: {
    where?: any;
    filters?: string;
    search?: string;
  }): Promise<User[]> {
    const query = { ...where };

    if (search) {
      query['$or'] = [
        { first_name: { $ilike: `%${search}%` } },
        { last_name: { $ilike: `%${search}%` } },
        { username: { $ilike: `%${search}%` } },
      ];
    }

    return await this.userRepository.find(query, {
      populate: ['roles', 'roles.permissions', 'permissions', 'groups'],
      limit: search ? 20 : undefined,
      filters: { tenant: true },
    });
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findOne(
      { id },
      {
        populate: ['roles', 'roles.permissions', 'permissions', 'groups'],
        filters: { tenant: false },
      },
    );
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne(
      { username },
      {
        populate: ['roles', 'roles.permissions', 'permissions', 'groups'],
        filters: { tenant: false },
      },
    );
  }

  async findOneByUsernameForAuth(username: string): Promise<User | null> {
    return await this.userRepository.findOne(
      { username },
      { filters: { tenant: false } },
    );
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    // 1: Find user
    const user = await this.userRepository.findOneOrFail(
      { id },
      {
        populate: ['roles', 'permissions', 'groups'],
        filters: { tenant: false },
      },
    );

    // 2: Get EntityManager
    const em = this.userRepository.getEntityManager();

    // 3: Extract collection fields from DTO
    const { roles, permissions, groups, ...userDataToUpdate } = dto;

    // 4: Explicitly handle roles collection
    if (roles !== undefined) {
      if (roles.length > 0) {
        const roleRefs = roles.map((roleId) => em.getReference(Role, roleId));
        user.roles.set(roleRefs);
      } else {
        user.roles.removeAll();
      }
    }

    // 5: Explicitly handle permissions collection
    if (permissions !== undefined) {
      if (permissions.length > 0) {
        const permRefs = permissions.map((permId) =>
          em.getReference(Permission, permId),
        );
        user.permissions.set(permRefs);
      } else {
        user.permissions.removeAll();
      }
    }

    // 6: Explicitly handle groups collection
    if (groups !== undefined) {
      if (groups.length > 0) {
        const groupRefs = groups.map((groupId) =>
          em.getReference(Group, groupId),
        );
        user.groups.set(groupRefs);
      } else {
        user.groups.removeAll();
      }
    }

    // 7: Update user with remaining fields (no collection fields)
    this.userRepository.assign(user, userDataToUpdate);

    // 8: If is_licensed is set to false (or remains false), ensure roles/permissions are removed
    if (user.is_licensed === false) {
      user.roles.removeAll();
      user.permissions.removeAll();
    }

    // 9: Save user
    await em.flush();
    return user;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.nativeDelete({ id });
  }

  async updateBulk(ids: string[], dto: UpdateUserDto): Promise<number> {
    return await this.userRepository.nativeUpdate({ id: { $in: ids } }, dto);
  }

  async deleteBulk(ids: string[]): Promise<number> {
    return await this.userRepository.nativeDelete({ id: { $in: ids } });
  }
}
