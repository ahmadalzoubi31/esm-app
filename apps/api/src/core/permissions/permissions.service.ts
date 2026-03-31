import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { Permission } from './entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  private readonly cache = new Map<
    string,
    { data: Permission[]; expires: number }
  >();
  private readonly ttlMs = 60_000;

  constructor(
    @InjectRepository(Permission)
    private readonly repo: EntityRepository<Permission>,
    @InjectRepository(User) private readonly userRepo: EntityRepository<User>,
  ) {}

  // --- CRUD Operations ---

  async create(dto: CreatePermissionDto): Promise<Permission> {
    const permission = this.repo.create({ ...dto });
    await this.repo.getEntityManager().persist(permission).flush();
    return permission;
  }

  async findAll(where: any = {}): Promise<Permission[]> {
    return this.repo.find(where, { orderBy: { key: QueryOrder.ASC } });
  }

  async findOne(id: string): Promise<Permission> {
    // findOneOrFail handles the NotFoundException automatically
    return this.repo.findOneOrFail({ id });
  }

  async update(id: string, dto: UpdatePermissionDto): Promise<Permission> {
    const permission = await this.findOne(id);
    this.repo.assign(permission, dto);
    await this.repo.getEntityManager().flush();
    return permission;
  }

  async remove(id: string): Promise<void> {
    await this.repo.nativeDelete({ id });
  }

  // --- RBAC & Inheritance Logic ---

  async getEffectivePermissions(
    userId: string,
    groupIds: string[] = [],
  ): Promise<Permission[]> {
    const key = `${userId}:${groupIds.sort().join(',')}`;
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) return cached.data;

    /**
     * COLLAPSED QUERY:
     * This replaces the 5-step manual ID collection with one SQL hit.
     * MikroORM joins the junction tables automatically.
     */
    const permissions = await this.repo.find(
      {
        $or: [
          { users: { id: userId } }, // Direct User Assignment
          { roles: { users: { id: userId } } }, // User -> Role -> Permission
          { roles: { groups: { id: { $in: groupIds } } } }, // Group -> Role -> Permission
        ],
      },
      { orderBy: { key: QueryOrder.ASC } },
    );

    this.cache.set(key, {
      data: permissions,
      expires: Date.now() + this.ttlMs,
    });
    return permissions;
  }

  // --- Assignments (Lazy Loading Pattern) ---

  async assignPermissionsToUser(
    userId: string,
    permissionIds: string[],
  ): Promise<boolean> {
    const user = await this.userRepo.findOneOrFail(
      { id: userId },
      { filters: { tenant: false } },
    );
    const perms = await this.repo.find({ id: { $in: permissionIds } });

    if (perms.length !== permissionIds.length) {
      throw new NotFoundException('Some permissions do not exist');
    }

    // loadItems() ensures we don't create duplicates in the join table
    await user.permissions.loadItems();
    perms.forEach((p) => user.permissions.add(p));

    await this.userRepo.getEntityManager().flush();
    return true;
  }

  async removePermissionsFromUser(
    userId: string,
    permissionIds: string[],
  ): Promise<boolean> {
    const user = await this.userRepo.findOneOrFail(
      { id: userId },
      { filters: { tenant: false } },
    );

    // Explicitly load for modification
    await user.permissions.loadItems();

    // Identify items to remove from the collection
    user.permissions
      .getItems()
      .filter((p) => permissionIds.includes(p.id))
      .forEach((p) => user.permissions.remove(p));

    await this.userRepo.getEntityManager().flush();
    return true;
  }
}
