import { Migration } from '@mikro-orm/migrations';

export class Migration20260325084304 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "permissions" ("id" uuid not null, "key" varchar(255) not null, "subject" varchar(255) not null, "action" varchar(255) not null, "conditions" jsonb null, "category" varchar(255) not null, "description" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "permissions_pkey" primary key ("id"));`);
    this.addSql(`create index "permissions_key_index" on "permissions" ("key");`);
    this.addSql(`alter table "permissions" add constraint "permissions_key_unique" unique ("key");`);

    this.addSql(`create table "refresh_token" ("id" serial primary key, "user_id" varchar(255) not null, "token" varchar(255) not null, "expires_at" timestamptz not null, "is_revoked" boolean not null, "created_at" timestamptz null, "revoked_at" timestamptz null, "ip_address" varchar(45) null, "user_agent" text null, "device_name" varchar(255) null, "last_activity" timestamptz null);`);

    this.addSql(`create table "service_cards" ("id" uuid not null, "display_title" varchar(200) not null, "short_description" text null, "icon" varchar(255) null, "color_theme" varchar(255) null, "display_order" int not null default 0, "badges" jsonb null, "is_requestable" boolean not null default true, "workflow_id" varchar(255) null, "expected_sla" jsonb null, "visibility_rules" jsonb null, constraint "service_cards_pkey" primary key ("id"));`);

    this.addSql(`create table "service_categories" ("id" uuid not null, "name" varchar(150) not null, "description" text null, "parent_category_id" varchar(255) null, "parent_id" uuid null, constraint "service_categories_pkey" primary key ("id"));`);

    this.addSql(`create table "service_form_schemas" ("id" uuid not null, "service_card_id" varchar(255) not null, "card_id" uuid not null, "json_schema" jsonb not null, "ui_schema" jsonb null, "data_sources" jsonb null, "is_active" boolean not null default true, constraint "service_form_schemas_pkey" primary key ("id"));`);

    this.addSql(`create table "tenants" ("id" varchar(255) not null, "name" varchar(255) not null, "slug" varchar(255) not null, "preferences" jsonb not null default '{}', "created_at" timestamptz null default CURRENT_TIMESTAMP, "updated_at" timestamptz null default CURRENT_TIMESTAMP, constraint "tenants_pkey" primary key ("id"));`);
    this.addSql(`alter table "tenants" add constraint "tenants_name_unique" unique ("name");`);
    this.addSql(`alter table "tenants" add constraint "tenants_slug_unique" unique ("slug");`);

    this.addSql(`create table "roles" ("id" varchar(255) not null, "tenant_id" varchar(255) not null, "created_at" timestamptz null default CURRENT_TIMESTAMP, "updated_at" timestamptz null default CURRENT_TIMESTAMP, "key" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "permission_count" int null default 0, "user_count" int null default 0, constraint "roles_pkey" primary key ("id"));`);
    this.addSql(`create index "roles_tenant_id_index" on "roles" ("tenant_id");`);
    this.addSql(`create index "roles_key_index" on "roles" ("key");`);
    this.addSql(`alter table "roles" add constraint "roles_key_tenant_id_unique" unique ("key", "tenant_id");`);

    this.addSql(`create table "role_permissions" ("role_id" varchar(255) not null, "permission_id" uuid not null, constraint "role_permissions_pkey" primary key ("role_id", "permission_id"));`);

    this.addSql(`create table "departments" ("id" varchar(255) not null, "tenant_id" varchar(255) not null, "created_at" timestamptz null default CURRENT_TIMESTAMP, "updated_at" timestamptz null default CURRENT_TIMESTAMP, "code" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "active" boolean not null default true, constraint "departments_pkey" primary key ("id"));`);
    this.addSql(`create index "departments_tenant_id_index" on "departments" ("tenant_id");`);

    this.addSql(`create table "categories" ("id" varchar(255) not null, "tenant_id" varchar(255) not null, "created_at" timestamptz null default CURRENT_TIMESTAMP, "updated_at" timestamptz null default CURRENT_TIMESTAMP, "name" varchar(255) not null, "description" varchar(255) null, constraint "categories_pkey" primary key ("id"));`);
    this.addSql(`create index "categories_tenant_id_index" on "categories" ("tenant_id");`);

    this.addSql(`create table "subcategories" ("id" varchar(255) not null, "tenant_id" varchar(255) not null, "created_at" timestamptz null default CURRENT_TIMESTAMP, "updated_at" timestamptz null default CURRENT_TIMESTAMP, "name" varchar(255) not null, "description" varchar(255) null, "category_id" varchar(255) not null, constraint "subcategories_pkey" primary key ("id"));`);
    this.addSql(`create index "subcategories_tenant_id_index" on "subcategories" ("tenant_id");`);

    this.addSql(`create table "business_lines" ("id" varchar(255) not null, "tenant_id" varchar(255) not null, "created_at" timestamptz null default CURRENT_TIMESTAMP, "updated_at" timestamptz null default CURRENT_TIMESTAMP, "key" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "active" boolean not null default true, constraint "business_lines_pkey" primary key ("id"));`);
    this.addSql(`create index "business_lines_tenant_id_index" on "business_lines" ("tenant_id");`);

    this.addSql(`create table "users" ("id" varchar(255) not null, "tenant_id" varchar(255) not null, "created_at" timestamptz null default CURRENT_TIMESTAMP, "updated_at" timestamptz null default CURRENT_TIMESTAMP, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "username" varchar(80) not null, "email" varchar(255) null, "display_name" varchar(150) null, "avatar" varchar(255) null, "department_id" varchar(255) null, "phone" varchar(255) null, "manager" varchar(255) null, "auth_source" text check ("auth_source" in ('local', 'ldap')) not null, "external_id" varchar(255) null, "password" varchar(255) null, "is_active" boolean not null default false, "last_login_at" timestamptz null, "is_licensed" boolean not null default false, "metadata" jsonb null, constraint "users_pkey" primary key ("id"));`);
    this.addSql(`create index "users_tenant_id_index" on "users" ("tenant_id");`);
    this.addSql(`create index "users_username_index" on "users" ("username");`);
    this.addSql(`alter table "users" add constraint "users_username_unique" unique ("username");`);

    this.addSql(`create table "services" ("id" uuid not null, "code" varchar(255) not null, "name" varchar(200) not null, "description" text null, "long_description" text null, "ownerUserId" varchar(255) null, "lifecycle_status" text check ("lifecycle_status" in ('DRAFT', 'ACTIVE', 'RETIRED')) not null default 'ACTIVE', "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "services_pkey" primary key ("id"));`);
    this.addSql(`alter table "services" add constraint "services_code_unique" unique ("code");`);

    this.addSql(`create table "service_requests" ("id" uuid not null, "request_number" varchar(255) not null, "serviceCardId" uuid not null, "serviceId" uuid null, "requester_user_id" varchar(255) not null, "requested_for_user_id" varchar(255) null, "current_status" varchar(255) not null default 'SUBMITTED', "current_assignee_user_id" varchar(255) null, "current_assignee_group_id" varchar(255) null, "priority" varchar(255) not null default 'NORMAL', "channel" varchar(255) not null default 'Portal', "sla_status" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "closed_at" date null, constraint "service_requests_pkey" primary key ("id"));`);
    this.addSql(`create index "service_requests_request_number_index" on "service_requests" ("request_number");`);

    this.addSql(`create table "groups" ("id" varchar(255) not null, "tenant_id" varchar(255) not null, "created_at" timestamptz null default CURRENT_TIMESTAMP, "updated_at" timestamptz null default CURRENT_TIMESTAMP, "name" varchar(120) not null, "type" varchar(255) not null, "description" varchar(255) null, "teamLeaderId" varchar(255) null, "businessLineId" varchar(255) not null, "department_id" varchar(255) null, constraint "groups_pkey" primary key ("id"));`);
    this.addSql(`create index "groups_tenant_id_index" on "groups" ("tenant_id");`);

    this.addSql(`create table "group_users" ("groupId" varchar(255) not null, "userId" varchar(255) not null, constraint "group_users_pkey" primary key ("groupId", "userId"));`);

    this.addSql(`create table "group_roles" ("role_id" varchar(255) not null, "group_id" varchar(255) not null, constraint "group_roles_pkey" primary key ("role_id", "group_id"));`);

    this.addSql(`create table "group_permissions" ("permission_id" uuid not null, "group_id" varchar(255) not null, constraint "group_permissions_pkey" primary key ("permission_id", "group_id"));`);

    this.addSql(`create table "cases" ("id" varchar(255) not null, "tenant_id" varchar(255) not null, "created_at" timestamptz null default CURRENT_TIMESTAMP, "updated_at" timestamptz null default CURRENT_TIMESTAMP, "number" varchar(30) not null, "title" varchar(50) not null, "description" text null, "status" text check ("status" in ('NEW', 'WAITING_FOR_APPROVAL', 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELED')) not null default 'NEW', "priority" text check ("priority" in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) not null default 'MEDIUM', "category_id" varchar(255) not null, "subcategory_id" varchar(255) null, "requester_id" varchar(255) not null, "assigneeId" varchar(255) null, "assignment_group_id" varchar(255) not null, "business_line_id" varchar(255) not null, "affected_service_id" uuid not null, "request_card_id" uuid null, constraint "cases_pkey" primary key ("id"));`);
    this.addSql(`create index "cases_tenant_id_index" on "cases" ("tenant_id");`);
    this.addSql(`create index "cases_number_index" on "cases" ("number");`);

    this.addSql(`create table "case_comments" ("id" varchar(255) not null, "tenant_id" varchar(255) not null, "created_at" timestamptz null default CURRENT_TIMESTAMP, "updated_at" timestamptz null default CURRENT_TIMESTAMP, "case_id" varchar(255) not null, "body" text not null, "is_private" boolean not null default true, constraint "case_comments_pkey" primary key ("id"));`);
    this.addSql(`create index "case_comments_tenant_id_index" on "case_comments" ("tenant_id");`);
    this.addSql(`create index "case_comments_case_id_created_at_index" on "case_comments" ("case_id", "created_at");`);

    this.addSql(`create table "case_attachments" ("id" varchar(255) not null, "tenant_id" varchar(255) not null, "created_at" timestamptz null default CURRENT_TIMESTAMP, "updated_at" timestamptz null default CURRENT_TIMESTAMP, "case_id" varchar(255) not null, "filename" varchar(255) not null, "original_name" varchar(255) not null, "mime_type" varchar(255) not null, "size" int not null, "storage_path" varchar(255) not null, constraint "case_attachments_pkey" primary key ("id"));`);
    this.addSql(`create index "case_attachments_tenant_id_index" on "case_attachments" ("tenant_id");`);

    this.addSql(`create table "user_permissions" ("permission_id" uuid not null, "user_id" varchar(255) not null, constraint "user_permissions_pkey" primary key ("permission_id", "user_id"));`);

    this.addSql(`create table "user_roles" ("role_id" varchar(255) not null, "user_id" varchar(255) not null, constraint "user_roles_pkey" primary key ("role_id", "user_id"));`);

    this.addSql(`alter table "service_categories" add constraint "service_categories_parent_id_foreign" foreign key ("parent_id") references "service_categories" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "service_form_schemas" add constraint "service_form_schemas_card_id_foreign" foreign key ("card_id") references "service_cards" ("id") on update cascade;`);

    this.addSql(`alter table "roles" add constraint "roles_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "role_permissions" add constraint "role_permissions_role_id_foreign" foreign key ("role_id") references "roles" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "role_permissions" add constraint "role_permissions_permission_id_foreign" foreign key ("permission_id") references "permissions" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "departments" add constraint "departments_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "categories" add constraint "categories_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "subcategories" add constraint "subcategories_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "subcategories" add constraint "subcategories_category_id_foreign" foreign key ("category_id") references "categories" ("id") on update cascade;`);

    this.addSql(`alter table "business_lines" add constraint "business_lines_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "users" add constraint "users_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "users" add constraint "users_department_id_foreign" foreign key ("department_id") references "departments" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "services" add constraint "services_ownerUserId_foreign" foreign key ("ownerUserId") references "users" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "service_requests" add constraint "service_requests_serviceCardId_foreign" foreign key ("serviceCardId") references "service_cards" ("id") on update cascade;`);
    this.addSql(`alter table "service_requests" add constraint "service_requests_serviceId_foreign" foreign key ("serviceId") references "services" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "groups" add constraint "groups_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "groups" add constraint "groups_teamLeaderId_foreign" foreign key ("teamLeaderId") references "users" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "groups" add constraint "groups_businessLineId_foreign" foreign key ("businessLineId") references "business_lines" ("id") on update cascade;`);
    this.addSql(`alter table "groups" add constraint "groups_department_id_foreign" foreign key ("department_id") references "departments" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "group_users" add constraint "group_users_groupId_foreign" foreign key ("groupId") references "groups" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "group_users" add constraint "group_users_userId_foreign" foreign key ("userId") references "users" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "group_roles" add constraint "group_roles_role_id_foreign" foreign key ("role_id") references "roles" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "group_roles" add constraint "group_roles_group_id_foreign" foreign key ("group_id") references "groups" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "group_permissions" add constraint "group_permissions_permission_id_foreign" foreign key ("permission_id") references "permissions" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "group_permissions" add constraint "group_permissions_group_id_foreign" foreign key ("group_id") references "groups" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "cases" add constraint "cases_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "cases" add constraint "cases_category_id_foreign" foreign key ("category_id") references "categories" ("id") on update cascade;`);
    this.addSql(`alter table "cases" add constraint "cases_subcategory_id_foreign" foreign key ("subcategory_id") references "subcategories" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "cases" add constraint "cases_requester_id_foreign" foreign key ("requester_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "cases" add constraint "cases_assigneeId_foreign" foreign key ("assigneeId") references "users" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "cases" add constraint "cases_assignment_group_id_foreign" foreign key ("assignment_group_id") references "groups" ("id") on update cascade;`);
    this.addSql(`alter table "cases" add constraint "cases_business_line_id_foreign" foreign key ("business_line_id") references "business_lines" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "cases" add constraint "cases_affected_service_id_foreign" foreign key ("affected_service_id") references "services" ("id") on update cascade;`);
    this.addSql(`alter table "cases" add constraint "cases_request_card_id_foreign" foreign key ("request_card_id") references "service_cards" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "case_comments" add constraint "case_comments_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "case_comments" add constraint "case_comments_case_id_foreign" foreign key ("case_id") references "cases" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "case_attachments" add constraint "case_attachments_tenant_id_foreign" foreign key ("tenant_id") references "tenants" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "case_attachments" add constraint "case_attachments_case_id_foreign" foreign key ("case_id") references "cases" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "user_permissions" add constraint "user_permissions_permission_id_foreign" foreign key ("permission_id") references "permissions" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_permissions" add constraint "user_permissions_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "user_roles" add constraint "user_roles_role_id_foreign" foreign key ("role_id") references "roles" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_roles" add constraint "user_roles_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);
  }

}
