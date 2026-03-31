import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { Group } from '../groups/entities/group.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const em = this.userRepository.getEntityManager();
    const { roleIds, permissionIds, groupIds, ...userData } = dto;

    // 1. Safe Tenant Handling
    const tenantFilter = em.getFilterParams('tenant');
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    // 2. Create base user (Collections are initialized as empty by MikroORM)
    const user = this.userRepository.create({
      ...userData,
      tenant: tenantRef,
    });

    // 3. Handle Collections using References (Fast, no extra SELECTs)
    if (roleIds?.length) {
      user.roles.set(roleIds.map((id) => em.getReference(Role, id)));
    }
    if (permissionIds?.length) {
      user.permissions.set(
        permissionIds.map((id) => em.getReference(Permission, id)),
      );
    }
    if (groupIds?.length) {
      user.groups.set(groupIds.map((id) => em.getReference(Group, id)));
    }

    await em.persist(user).flush();
    return user;
  }

  async findAll({
    where = {},
    search,
  }: {
    where?: any;
    search?: string;
  }): Promise<User[]> {
    const query = { ...where };

    if (search) {
      query.$or = [
        { firstName: { $ilike: `%${search}%` } },
        { lastName: { $ilike: `%${search}%` } },
        { username: { $ilike: `%${search}%` } },
        { email: { $ilike: `%${search}%` } },
      ];
    }

    return this.userRepository.find(query, {
      populate: [
        'roles.permissions',
        'permissions',
        'groups.roles.permissions',
        'groups.permissions',
        'department',
      ],
      limit: search ? 20 : undefined,
      orderBy: { createdAt: QueryOrder.DESC },
    });
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOneOrFail(
      { id },
      {
        populate: [
          'roles.permissions',
          'permissions',
          'groups.roles.permissions',
          'department',
        ],
        filters: { tenant: false },
      },
    );
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const em = this.userRepository.getEntityManager();
    const { roleIds, permissionIds, groupIds, ...userDataToUpdate } = dto;

    // 1. Update basic fields
    this.userRepository.assign(user, userDataToUpdate);

    // 2. Handle Collections with .set() (Clears old, adds new)
    if (roleIds !== undefined) {
      user.roles.set(roleIds.map((id) => em.getReference(Role, id)));
    }
    if (permissionIds !== undefined) {
      user.permissions.set(
        permissionIds.map((id) => em.getReference(Permission, id)),
      );
    }
    if (groupIds !== undefined) {
      user.groups.set(groupIds.map((id) => em.getReference(Group, id)));
    }

    // 3. Business Rule: Licensing check
    if (user.isLicensed === false) {
      user.roles.removeAll();
      user.permissions.removeAll();
    }

    await em.flush();
    return user;
  }

  // --- Utility Methods ---

  async findOneByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne(
      { username },
      { filters: { tenant: false } },
    );
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.nativeDelete({ id });
  }

  async deleteBulk(ids: string[]): Promise<number> {
    return this.userRepository.nativeDelete({ id: { $in: ids } });
  }

  async uploadAvatar(file: Express.Multer.File): Promise<string> {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase configuration is missing in environment variables',
      );
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload avatar: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return publicUrl;
  }
}
