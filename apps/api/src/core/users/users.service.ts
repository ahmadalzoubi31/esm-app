import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { Group } from '../groups/entities/group.entity';
import { Tenant } from 'src/tenants/entities/tenant.entity';

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

    // 3: Get Tenant ID from Filter
    const tenantFilter = em.getFilterParams('tenant');

    // 3.1: Get Tenant Reference
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    // 4: Create user with non-collection fields
    const user = this.userRepository.create({
      ...userDataToCreate,
      tenant: tenantRef,
    });

    // 5: Handle roles collection
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

  async findAll({
    where = {},
    search,
  }: {
    where?: any;
    search?: string;
  }): Promise<User[]> {
    const query = { ...where };

    if (search) {
      query['$or'] = [
        { first_name: { $ilike: `%${search}%` } },
        { last_name: { $ilike: `%${search}%` } },
        { username: { $ilike: `%${search}%` } },
        { email: { $ilike: `%${search}%` } },
      ];
    }

    return await this.userRepository.find(query, {
      populate: [
        'roles',
        'roles.permissions',
        'permissions',
        'groups',
        'groups.roles',
        'groups.roles.permissions',
        'groups.permissions',
        'department',
      ],
      limit: search ? 20 : undefined,
      filters: { tenant: true },
    });
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findOne(
      { id },
      {
        populate: [
          'roles',
          'roles.permissions',
          'permissions',
          'groups',
          'groups.roles',
          'groups.roles.permissions',
          'groups.permissions',
          'department',
        ],
        filters: { tenant: false },
      },
    );
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne(
      { username },
      {
        populate: [
          'roles',
          'roles.permissions',
          'permissions',
          'groups',
          'groups.roles',
          'groups.roles.permissions',
          'groups.permissions',
          'department',
        ],
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
        populate: ['roles', 'permissions', 'groups', 'department'],
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
