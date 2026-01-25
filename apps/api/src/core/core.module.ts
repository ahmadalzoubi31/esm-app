import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { CaslModule } from './casl/casl.module';
import { BusinessLineModule } from './business-lines/business-line.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    GroupsModule,
    RolesModule,
    PermissionsModule,
    CaslModule,
    BusinessLineModule,
    GroupsModule,
  ],
})
export class CoreModule {}
