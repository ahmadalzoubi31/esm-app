import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Role } from './entities/role.entity';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { PermissionsModule } from '../permissions/permissions.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, PermissionsModule, MikroOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService, CaslAbilityFactory],
  exports: [RolesService],
})
export class RolesModule {}
