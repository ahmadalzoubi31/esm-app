import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { PermissionsModule } from '../permissions/permissions.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Group } from './entities/group.entity';

@Module({
  imports: [PermissionsModule, MikroOrmModule.forFeature([Group])],
  controllers: [GroupsController],
  providers: [GroupsService, CaslAbilityFactory],
  exports: [GroupsService],
})
export class GroupsModule {}
