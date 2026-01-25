import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { PermissionsService } from '../permissions/permissions.service';
import { PermissionsModule } from '../permissions/permissions.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';
@Module({
  imports: [MikroOrmModule.forFeature([Permission, Role, User])],
  providers: [CaslAbilityFactory, PermissionsService],
  exports: [CaslAbilityFactory, PermissionsService],
})
export class CaslModule {}
