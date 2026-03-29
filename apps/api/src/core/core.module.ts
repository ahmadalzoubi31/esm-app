import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { CaslModule } from './casl/casl.module';
import { BusinessLineModule } from './business-lines/business-line.module';
import { GroupsModule } from './groups/groups.module';
import { DepartmentsModule } from './departments/departments.module';
import { CategoriesModule } from './categories/categories.module';
import { AuditModule } from './audit/audit.module';
import { SlaModule } from './sla/sla.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    GroupsModule,
    RolesModule,
    PermissionsModule,
    CaslModule,
    BusinessLineModule,
    DepartmentsModule,
    CategoriesModule,
    AuditModule,
    SlaModule,
  ],
})
export class CoreModule {}
