import { Migration } from '@mikro-orm/migrations';

export class Migration20260311103411 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "case_categories" ("id" varchar(255) not null, "tenant_id" varchar(255) not null, "created_at" timestamptz null default CURRENT_TIMESTAMP, "updated_at" timestamptz null default CURRENT_TIMESTAMP, "name" varchar(255) not null, "description" varchar(255) null, constraint "case_categories_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "case_categories_tenant_id_index" on "case_categories" ("tenant_id");`,
    );

    this.addSql(
      `create table "case_subcategories" ("id" varchar(255) not null, "tenant_id" varchar(255) not null, "created_at" timestamptz null default CURRENT_TIMESTAMP, "updated_at" timestamptz null default CURRENT_TIMESTAMP, "name" varchar(255) not null, "description" varchar(255) null, "categoryId" varchar(255) not null, constraint "case_subcategories_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "case_subcategories_tenant_id_index" on "case_subcategories" ("tenant_id");`,
    );

    this.addSql(
      `create table "cases" ("id" varchar(255) not null, "tenant_id" varchar(255) not null, "created_at" timestamptz null default CURRENT_TIMESTAMP, "updated_at" timestamptz null default CURRENT_TIMESTAMP, "number" varchar(30) not null, "title" varchar(200) not null, "description" text null, "status" text check ("status" in ('NEW', 'WAITING_FOR_APPROVAL', 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELED')) not null default 'NEW', "priority" text check ("priority" in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) not null default 'MEDIUM', "category_id" varchar(255) not null, "subcategory_id" varchar(255) null, "requester_id" varchar(255) not null, "assignee_id" varchar(255) null, "assignment_group_id" varchar(255) not null, "business_line_id" varchar(255) not null, "affected_service_id" uuid not null, "request_card_id" uuid null, constraint "cases_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "cases_tenant_id_index" on "cases" ("tenant_id");`,
    );
    this.addSql(`create index "cases_number_index" on "cases" ("number");`);

    this.addSql(
      `create table "case_comments" ("id" varchar(255) not null, "tenant_id" varchar(255) not null, "created_at" timestamptz null default CURRENT_TIMESTAMP, "updated_at" timestamptz null default CURRENT_TIMESTAMP, "case_id" varchar(255) not null, "body" text not null, "is_private" boolean not null default true, constraint "case_comments_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "case_comments_tenant_id_index" on "case_comments" ("tenant_id");`,
    );
    this.addSql(
      `create index "case_comments_case_id_created_at_index" on "case_comments" ("case_id", "created_at");`,
    );

    this.addSql(
      `create table "case_attachments" ("id" varchar(255) not null, "tenant_id" varchar(255) not null, "created_at" timestamptz null default CURRENT_TIMESTAMP, "updated_at" timestamptz null default CURRENT_TIMESTAMP, "case_id" varchar(255) not null, "filename" varchar(255) not null, "original_name" varchar(255) not null, "mime_type" varchar(255) not null, "size" int not null, "storage_path" varchar(255) not null, constraint "case_attachments_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "case_attachments_tenant_id_index" on "case_attachments" ("tenant_id");`,
    );

    this.addSql(
      `alter table "case_categories" add constraint "case_categories_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "case_subcategories" add constraint "case_subcategories_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "case_subcategories" add constraint "case_subcategories_categoryId_foreign" foreign key ("categoryId") references "case_categories" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "cases" add constraint "cases_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "cases" add constraint "cases_category_id_foreign" foreign key ("category_id") references "case_categories" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "cases" add constraint "cases_subcategory_id_foreign" foreign key ("subcategory_id") references "case_subcategories" ("id") on update cascade on delete set null;`,
    );
    this.addSql(
      `alter table "cases" add constraint "cases_requester_id_foreign" foreign key ("requester_id") references "users" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "cases" add constraint "cases_assignee_id_foreign" foreign key ("assignee_id") references "users" ("id") on update cascade on delete set null;`,
    );
    this.addSql(
      `alter table "cases" add constraint "cases_assignment_group_id_foreign" foreign key ("assignment_group_id") references "groups" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "cases" add constraint "cases_business_line_id_foreign" foreign key ("business_line_id") references "business_lines" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "cases" add constraint "cases_affected_service_id_foreign" foreign key ("affected_service_id") references "services" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "cases" add constraint "cases_request_card_id_foreign" foreign key ("request_card_id") references "service_cards" ("id") on update cascade on delete set null;`,
    );

    this.addSql(
      `alter table "case_comments" add constraint "case_comments_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "case_comments" add constraint "case_comments_case_id_foreign" foreign key ("case_id") references "cases" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "case_attachments" add constraint "case_attachments_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "case_attachments" add constraint "case_attachments_case_id_foreign" foreign key ("case_id") references "cases" ("id") on update cascade on delete cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "case_subcategories" drop constraint "case_subcategories_categoryId_foreign";`,
    );

    this.addSql(
      `alter table "cases" drop constraint "cases_category_id_foreign";`,
    );

    this.addSql(
      `alter table "cases" drop constraint "cases_subcategory_id_foreign";`,
    );

    this.addSql(
      `alter table "case_comments" drop constraint "case_comments_case_id_foreign";`,
    );

    this.addSql(
      `alter table "case_attachments" drop constraint "case_attachments_case_id_foreign";`,
    );

    this.addSql(`drop table if exists "case_categories" cascade;`);

    this.addSql(`drop table if exists "case_subcategories" cascade;`);

    this.addSql(`drop table if exists "cases" cascade;`);

    this.addSql(`drop table if exists "case_comments" cascade;`);

    this.addSql(`drop table if exists "case_attachments" cascade;`);
  }
}
