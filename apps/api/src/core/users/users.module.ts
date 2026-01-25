import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [PermissionsModule, MikroOrmModule.forFeature([User])],
  providers: [UsersService, CaslAbilityFactory],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
