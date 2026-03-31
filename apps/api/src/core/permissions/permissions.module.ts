import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Permission } from './entities/permission.entity';
import { User } from '../users/entities/user.entity';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  imports: [MikroOrmModule.forFeature([Permission, User])],
  controllers: [PermissionsController],
  providers: [PermissionsService, CaslAbilityFactory],
  exports: [PermissionsService, CaslAbilityFactory],
})
export class PermissionsModule {}
