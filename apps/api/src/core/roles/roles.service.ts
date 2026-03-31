import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Role } from './entities/role.entity';
import { PermissionsService } from '../permissions/permissions.service';
import { UsersService } from '../users/users.service';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: EntityRepository<Role>,
    private readonly permissionsService: PermissionsService,
    private readonly usersService: UsersService,
  ) {}

  // --- CRUD ---

  async create(dto: CreateRoleDto): Promise<Role> {
    const { permissionIds, ...roleData } = dto;
    const em = this.roleRepo.getEntityManager();

    // 1. Safe Tenant Handling
    const tenantFilter = em.getFilterParams('tenant');
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    // 2. Create and persist
    const role = this.roleRepo.create({
      ...dto,
      tenant: tenantRef,
      isActive: true,
    });
    await em.persist(role).flush();

    // 4. Assign permissions if present
    if (permissionIds?.length) {
      await this.assignPermissions(role.id, permissionIds);
    }

    return role;
  }

  async findAll({ where }: { where?: any } = {}): Promise<Role[]> {
    return this.roleRepo.find(where || {}, {
      populate: ['permissions'],
      filters: { tenant: false }, // Broad lookup usually ignores standard tenant scoping
    });
  }

  async findOne(id: string): Promise<Role> {
    return this.roleRepo.findOneOrFail(
      { id },
      { populate: ['permissions'], filters: { tenant: false } },
    );
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    this.roleRepo.assign(role, dto);
    await this.roleRepo.getEntityManager().flush();
    return role;
  }

  async remove(id: string): Promise<void> {
    await this.roleRepo.nativeDelete({ id });
  }

  // --- Permission Management (Lazy Loading Pattern) ---

  async assignPermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<Role> {
    // 1. Lean Fetch
    const role = await this.roleRepo.findOneOrFail(
      { id: roleId },
      { filters: { tenant: false } },
    );

    // 2. Verify Permissions
    const permissions = await this.permissionsService.findAll({
      where: { id: { $in: permissionIds } },
    });

    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('One or more permissions not found');
    }

    // 3. Load for modification
    await role.permissions.loadItems();
    permissions.forEach((perm) => role.permissions.add(perm));
    role.permissionCount = role.permissions.length;

    await this.roleRepo.getEntityManager().flush();
    return role;
  }

  async removePermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<Role> {
    const role = await this.roleRepo.findOneOrFail(
      { id: roleId },
      { filters: { tenant: false } },
    );

    await role.permissions.loadItems();
    role.permissions
      .getItems()
      .filter((p) => permissionIds.includes(p.id))
      .forEach((p) => role.permissions.remove(p));

    role.permissionCount = role.permissions.length;

    await this.roleRepo.getEntityManager().flush();
    return role;
  }

  // --- User-Role Assignments ---

  async assignRolesToUser(userId: string, roleIds: string[]): Promise<boolean> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const roles = await this.roleRepo.find(
      { id: { $in: roleIds } },
      { filters: { tenant: false } },
    );

    if (roles.length !== roleIds.length) {
      throw new NotFoundException('One or more roles not found');
    }

    // MikroORM Collection add handles duplicates automatically
    await user.roles.loadItems();
    roles.forEach((role) => user.roles.add(role));

    await this.roleRepo.getEntityManager().flush();
    return true;
  }

  async removeRolesFromUser(
    userId: string,
    roleIds: string[],
  ): Promise<boolean> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    await user.roles.loadItems();
    user.roles
      .getItems()
      .filter((r) => roleIds.includes(r.id))
      .forEach((role) => user.roles.remove(role));

    await this.roleRepo.getEntityManager().flush();
    return true;
  }

  async deleteBulk(ids: string[]): Promise<number> {
    return this.roleRepo.nativeDelete({ id: { $in: ids } });
  }
}
