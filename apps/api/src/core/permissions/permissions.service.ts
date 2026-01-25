import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Permission } from './entities/permission.entity';
import { EntityRepository } from '@mikro-orm/core';
import { Role } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PermissionsService {
  // Cache for effective permissions
  private readonly cache = new Map<
    string,
    { data: Permission[]; expires: number }
  >();
  // Cache TTL in milliseconds
  private readonly ttlMs = 60_000; // 1 minute cache TTL

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: EntityRepository<Permission>,
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepository.create({
      ...createPermissionDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.permissionRepository
      .getEntityManager()
      .persist(permission)
      .flush();
    return permission;
  }

  async findAll({ where }: { where?: any }): Promise<Permission[]> {
    return await this.permissionRepository.find(where || {});
  }

  async findOne(id: string): Promise<Permission | null> {
    return await this.permissionRepository.findOne(
      { id },
      {
        populate: ['roles', 'users'],
      },
    );
  }

  async update(id: string, dto: UpdatePermissionDto): Promise<Permission> {
    const permission = await this.permissionRepository.findOneOrFail({ id });
    this.permissionRepository.assign(permission, dto);
    await this.permissionRepository.getEntityManager().flush();
    return permission;
  }

  async remove(id: string): Promise<void> {
    await this.permissionRepository.nativeDelete({ id });
  }

  async getEffectivePermissions(
    userId: string,
    groupIds: string[],
  ): Promise<Permission[]> {
    // 1. Generate cache key
    const key = `${userId}:${groupIds.sort().join(',')}`;

    // 2. Check cache
    const cached = this.cache.get(key);

    // 3. Return cached data if still valid
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }

    // 4. Get roles assigned directly to user
    const userRoles = await this.roleRepository.find({
      users: { id: userId },
    });
    const userRoleIds = userRoles.map((r) => r.id);

    // 5. Get roles assigned to user's groups
    const groupRoles = await this.roleRepository.find({
      groups: { id: { $in: groupIds } },
    });
    const groupRoleIds = groupRoles.map((r) => r.id);

    // Merge all unique role IDs
    const allRoleIds = [...new Set([...userRoleIds, ...groupRoleIds])];

    // 6. Get permissions from all roles
    let rolePermIds: string[] = [];
    if (allRoleIds.length > 0) {
      const rolePerms = await this.permissionRepository.find({
        roles: { id: { $in: allRoleIds } },
      });
      rolePermIds = rolePerms.map((p) => p.id);
    }

    // 7. Get direct user permissions (not through roles)
    const userPerms = await this.permissionRepository.find({
      users: { id: userId },
    });
    const userPermIds = userPerms.map((p) => p.id);

    // 8. Merge all unique permission IDs
    const allPermIds = [...new Set([...rolePermIds, ...userPermIds])];

    if (allPermIds.length === 0) {
      this.cache.set(key, {
        data: [],
        expires: Date.now() + this.ttlMs,
      });
      return [];
    }

    // 9. Fetch actual permission entities
    const permissions = await this.permissionRepository.find({
      id: { $in: allPermIds },
    });

    // 10. Cache the results
    this.cache.set(key, {
      data: permissions,
      expires: Date.now() + this.ttlMs,
    });

    return permissions;
  }

  async assignPermissionsToUser(
    userId: string,
    permissionIds: string[],
  ): Promise<boolean> {
    // 1. Find User
    const user = await this.userRepository.findOne(
      { id: userId },
      {
        populate: ['permissions'],
      },
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Check permissions existence
    const permissions = await this.permissionRepository.find({
      id: { $in: permissionIds },
    });
    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('One or more permissions not found');
    }

    // 3. Assign permissions to user
    await user.permissions.loadItems();
    permissions.forEach((perm) => user.permissions.add(perm));

    await this.permissionRepository.getEntityManager().flush();
    return true;
  }

  async removePermissionsFromUser(
    userId: string,
    permissionIds: string[],
  ): Promise<boolean> {
    // 1. Find User
    const user = await this.userRepository.findOne(
      { id: userId },
      {
        populate: ['permissions'],
      },
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Remove permissions from user
    await user.permissions.loadItems();
    const permsToRemove = user.permissions
      .getItems()
      .filter((p) => permissionIds.includes(p.id));
    permsToRemove.forEach((perm) => user.permissions.remove(perm));

    await this.permissionRepository.getEntityManager().flush();
    return true;
  }
}
