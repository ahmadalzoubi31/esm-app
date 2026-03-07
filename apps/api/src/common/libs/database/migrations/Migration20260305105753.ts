import { Migration } from '@mikro-orm/migrations';

export class Migration20260305105753 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "roles" drop constraint "roles_tenant_id_foreign";`);

    this.addSql(`alter table "business_lines" drop constraint "business_lines_tenant_id_foreign";`);

    this.addSql(`alter table "users" drop constraint "users_tenant_id_foreign";`);

    this.addSql(`alter table "groups" drop constraint "groups_tenant_id_foreign";`);

    this.addSql(`alter table "roles" add constraint "roles_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "business_lines" add constraint "business_lines_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "users" add constraint "users_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "groups" add constraint "groups_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "roles" drop constraint "roles_tenant_id_foreign";`);

    this.addSql(`alter table "business_lines" drop constraint "business_lines_tenant_id_foreign";`);

    this.addSql(`alter table "users" drop constraint "users_tenant_id_foreign";`);

    this.addSql(`alter table "groups" drop constraint "groups_tenant_id_foreign";`);

    this.addSql(`alter table "roles" add constraint "roles_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade;`);

    this.addSql(`alter table "business_lines" add constraint "business_lines_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade;`);

    this.addSql(`alter table "users" add constraint "users_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade;`);

    this.addSql(`alter table "groups" add constraint "groups_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade;`);
  }

}
