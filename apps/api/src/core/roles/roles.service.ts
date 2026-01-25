import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Role } from './entities/role.entity';
import { EntityRepository } from '@mikro-orm/core';
import { Permission } from '../permissions/entities/permission.entity';
import { PermissionsService } from '../permissions/permissions.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
    private permissionsService: PermissionsService,
    private readonly usersService: UsersService,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // 1. Create role
    const role = this.roleRepository.create({
      ...createRoleDto,
      key: createRoleDto.name.toLowerCase().replace(/\s/g, '-'),
      permissionCount: 0,
      userCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // 2. Save role and return it
    await this.roleRepository.getEntityManager().persist(role).flush();
    return role;
  }

  async findAll({ where }: { where?: any }): Promise<Role[]> {
    return await this.roleRepository.find(where || {}, {
      populate: ['permissions'],
    });
  }

  async findOne(id: string): Promise<Role | null> {
    return await this.roleRepository.findOne({ id });
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findOneOrFail({ id });
    this.roleRepository.assign(role, dto);
    await this.roleRepository.getEntityManager().flush();
    return role;
  }

  async remove(id: string): Promise<void> {
    await this.roleRepository.nativeDelete({ id });
  }

  async findPermissions(id: string): Promise<Permission[]> {
    return await this.permissionsService.findAll({ where: { roles: { id } } });
  }

  async assignPermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<Role> {
    // 1. Find Role from database
    const role = await this.roleRepository.findOne(
      { id: roleId },
      { populate: ['permissions'] },
    );

    // 2. Check if the role exists, if not throw error
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // 3. Find Permissions from database using permissionIds
    const permissions = await this.permissionsService.findAll({
      where: { id: { $in: permissionIds } },
    });

    // 4. Check if all permissions exist, if not throw error
    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('One or more permissions not found');
    }

    // 5. Assign permissions to role
    await role.permissions.loadItems();
    permissions.forEach((perm) => role.permissions.add(perm));
    role.permissionCount = role.permissions.length;

    // 6. Save role and return it
    await this.roleRepository.getEntityManager().flush();
    return role;
  }

  async removePermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<Role> {
    // 1. Find Role from database
    const role = await this.roleRepository.findOne(
      { id: roleId },
      { populate: ['permissions'] },
    );

    // 2. Check if the role exists, if not throw error
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // 3. Remove permissions from role
    await role.permissions.loadItems();
    const permsToRemove = role.permissions
      .getItems()
      .filter((p) => permissionIds.includes(p.id));
    permsToRemove.forEach((perm) => role.permissions.remove(perm));
    role.permissionCount = role.permissions.length;

    // 4. Save role and return it
    await this.roleRepository.getEntityManager().flush();
    return role;
  }

  async assignRolesToUser(userId: string, roleIds: string[]): Promise<boolean> {
    // 1. Find User
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Check roles existence
    const roles = await this.roleRepository.find({ id: { $in: roleIds } });
    if (roles.length !== roleIds.length) {
      throw new NotFoundException('One or more roles not found');
    }

    // 3. Assign roles to user
    await user.roles.loadItems();
    roles.forEach((role) => user.roles.add(role));

    // 4. Save and return
    await this.roleRepository.getEntityManager().flush();
    return true;
  }

  async removeRolesFromUser(
    userId: string,
    roleIds: string[],
  ): Promise<boolean> {
    // 1. Find User
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Remove roles from user
    await user.roles.loadItems();
    const rolesToRemove = user.roles
      .getItems()
      .filter((r) => roleIds.includes(r.id));
    rolesToRemove.forEach((role) => user.roles.remove(role));

    // 3. Save and return
    await this.roleRepository.getEntityManager().flush();
    return true;
  }
}
