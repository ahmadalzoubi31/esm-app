import { Migration } from '@mikro-orm/migrations';

export class Migration20260310165659 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "departments" ("id" varchar(255) not null, "tenant_id" varchar(255) not null, "created_at" timestamptz null default CURRENT_TIMESTAMP, "updated_at" timestamptz null default CURRENT_TIMESTAMP, "code" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "active" boolean not null default true, constraint "departments_pkey" primary key ("id"));`);
    this.addSql(`create index "departments_tenant_id_index" on "departments" ("tenant_id");`);

    this.addSql(`alter table "departments" add constraint "departments_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "users" drop column "department";`);

    this.addSql(`alter table "users" add column "department_id" varchar(255) null;`);
    this.addSql(`alter table "users" add constraint "users_department_id_foreign" foreign key ("department_id") references "departments" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "groups" add column "department_id" varchar(255) null;`);
    this.addSql(`alter table "groups" add constraint "groups_department_id_foreign" foreign key ("department_id") references "departments" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" drop constraint "users_department_id_foreign";`);

    this.addSql(`alter table "groups" drop constraint "groups_department_id_foreign";`);

    this.addSql(`drop table if exists "departments" cascade;`);

    this.addSql(`alter table "users" drop column "department_id";`);

    this.addSql(`alter table "users" add column "department" varchar(255) null;`);

    this.addSql(`alter table "groups" drop column "department_id";`);
  }

}
