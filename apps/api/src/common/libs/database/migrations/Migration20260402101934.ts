import { Migration } from '@mikro-orm/migrations';

export class Migration20260402101934 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "permissions" ("id" uuid not null, "key" varchar(255) not null, "subject" varchar(255) not null, "action" varchar(255) not null, "conditions" jsonb null, "category" varchar(255) not null, "description" varchar(255) null, "createdAt" timestamptz null, "updatedAt" timestamptz null, constraint "permissions_pkey" primary key ("id"));`);
    this.addSql(`create index "permissions_key_index" on "permissions" ("key");`);
    this.addSql(`alter table "permissions" add constraint "permissions_key_unique" unique ("key");`);

    this.addSql(`create table "refresh_tokens" ("id" serial primary key, "userId" varchar(255) not null, "token" varchar(255) not null, "expiresAt" timestamptz not null, "isRevoked" boolean not null, "createdAt" timestamptz null, "revokedAt" timestamptz null, "ipAddress" varchar(45) null, "userAgent" text null, "deviceName" varchar(255) null, "lastActivity" timestamptz null);`);

    this.addSql(`create table "service_cards" ("id" uuid not null, "displayTitle" varchar(200) not null, "shortDescription" text null, "icon" varchar(255) null, "colorTheme" varchar(255) null, "displayOrder" int not null default 0, "badges" jsonb null, "isRequestable" boolean not null default true, "workflowId" varchar(255) null, "expectedSla" jsonb null, "visibilityRules" jsonb null, constraint "service_cards_pkey" primary key ("id"));`);

    this.addSql(`create table "service_categories" ("id" uuid not null, "name" varchar(150) not null, "description" text null, "parentCategoryId" varchar(255) null, "parent" uuid null, constraint "service_categories_pkey" primary key ("id"));`);

    this.addSql(`create table "service_form_schemas" ("id" uuid not null, "serviceCardId" varchar(255) not null, "card" uuid not null, "jsonSchema" jsonb not null, "uiSchema" jsonb null, "dataSources" jsonb null, "isActive" boolean not null default true, constraint "service_form_schemas_pkey" primary key ("id"));`);

    this.addSql(`create table "tenants" ("id" varchar(255) not null, "name" varchar(255) not null, "slug" varchar(255) not null, "preferences" jsonb not null default '{}', "createdAt" timestamptz null default CURRENT_TIMESTAMP, "updatedAt" timestamptz null default CURRENT_TIMESTAMP, constraint "tenants_pkey" primary key ("id"));`);
    this.addSql(`alter table "tenants" add constraint "tenants_name_unique" unique ("name");`);
    this.addSql(`alter table "tenants" add constraint "tenants_slug_unique" unique ("slug");`);

    this.addSql(`create table "sub_categories" ("id" varchar(255) not null, "tenantId" varchar(255) not null, "createdAt" timestamptz not null default CURRENT_TIMESTAMP, "updatedAt" timestamptz not null default CURRENT_TIMESTAMP, "isActive" boolean not null default true, "name" varchar(255) not null, "description" varchar(255) null, constraint "sub_categories_pkey" primary key ("id"));`);
    this.addSql(`create index "sub_categories_tenantId_index" on "sub_categories" ("tenantId");`);
    this.addSql(`alter table "sub_categories" add constraint "sub_categories_name_unique" unique ("name");`);

    this.addSql(`create table "sla_targets" ("id" varchar(255) not null, "tenantId" varchar(255) not null, "createdAt" timestamptz not null default CURRENT_TIMESTAMP, "updatedAt" timestamptz not null default CURRENT_TIMESTAMP, "isActive" boolean not null default true, "type" varchar(255) not null, "name" varchar(255) not null, "description" text null, "goalMs" int not null, "rules" jsonb not null, constraint "sla_targets_pkey" primary key ("id"));`);
    this.addSql(`create index "sla_targets_tenantId_index" on "sla_targets" ("tenantId");`);
    this.addSql(`create index "sla_targets_name_index" on "sla_targets" ("name");`);

    this.addSql(`create table "roles" ("id" varchar(255) not null, "tenantId" varchar(255) not null, "createdAt" timestamptz not null default CURRENT_TIMESTAMP, "updatedAt" timestamptz not null default CURRENT_TIMESTAMP, "isActive" boolean not null default true, "name" varchar(255) not null, "description" varchar(255) null, "permissionCount" int null default 0, "userCount" int null default 0, constraint "roles_pkey" primary key ("id"));`);
    this.addSql(`create index "roles_tenantId_index" on "roles" ("tenantId");`);
    this.addSql(`alter table "roles" add constraint "roles_name_tenantId_unique" unique ("name", "tenantId");`);

    this.addSql(`create table "roles_permissions" ("role" varchar(255) not null, "permission" uuid not null, constraint "roles_permissions_pkey" primary key ("role", "permission"));`);

    this.addSql(`create table "departments" ("id" varchar(255) not null, "tenantId" varchar(255) not null, "createdAt" timestamptz not null default CURRENT_TIMESTAMP, "updatedAt" timestamptz not null default CURRENT_TIMESTAMP, "isActive" boolean not null default true, "name" varchar(255) not null, "description" varchar(255) null, constraint "departments_pkey" primary key ("id"));`);
    this.addSql(`create index "departments_tenantId_index" on "departments" ("tenantId");`);
    this.addSql(`alter table "departments" add constraint "departments_name_tenantId_unique" unique ("name", "tenantId");`);

    this.addSql(`create table "categories" ("id" varchar(255) not null, "tenantId" varchar(255) not null, "createdAt" timestamptz not null default CURRENT_TIMESTAMP, "updatedAt" timestamptz not null default CURRENT_TIMESTAMP, "isActive" boolean not null default true, "name" varchar(255) not null, "description" varchar(255) null, constraint "categories_pkey" primary key ("id"));`);
    this.addSql(`create index "categories_tenantId_index" on "categories" ("tenantId");`);
    this.addSql(`alter table "categories" add constraint "categories_name_unique" unique ("name");`);

    this.addSql(`create table "categories_subCategories" ("category" varchar(255) not null, "subCategory" varchar(255) not null, constraint "categories_subCategories_pkey" primary key ("category", "subCategory"));`);

    this.addSql(`create table "business_lines" ("id" varchar(255) not null, "tenantId" varchar(255) not null, "createdAt" timestamptz not null default CURRENT_TIMESTAMP, "updatedAt" timestamptz not null default CURRENT_TIMESTAMP, "isActive" boolean not null default true, "name" varchar(255) not null, "description" varchar(255) null, constraint "business_lines_pkey" primary key ("id"));`);
    this.addSql(`create index "business_lines_tenantId_index" on "business_lines" ("tenantId");`);
    this.addSql(`alter table "business_lines" add constraint "business_lines_name_unique" unique ("name");`);
    this.addSql(`create index "idx_business_line_name" on "business_lines" ("name");`);

    this.addSql(`create table "audit_logs" ("id" varchar(255) not null, "tenantId" varchar(255) not null, "createdAt" timestamptz not null default CURRENT_TIMESTAMP, "updatedAt" timestamptz not null default CURRENT_TIMESTAMP, "isActive" boolean not null default true, "entityType" varchar(255) not null, "entityId" varchar(255) not null, "event" varchar(255) not null, "payload" jsonb null, constraint "audit_logs_pkey" primary key ("id"));`);
    this.addSql(`create index "audit_logs_tenantId_index" on "audit_logs" ("tenantId");`);

    this.addSql(`create table "users" ("id" varchar(255) not null, "tenantId" varchar(255) not null, "createdAt" timestamptz not null default CURRENT_TIMESTAMP, "updatedAt" timestamptz not null default CURRENT_TIMESTAMP, "firstName" varchar(255) not null, "lastName" varchar(255) not null, "username" varchar(80) not null, "email" varchar(255) null, "displayName" varchar(150) null, "avatar" varchar(255) null, "department" varchar(255) null, "phone" varchar(255) null, "manager" varchar(255) null, "authSource" text check ("authSource" in ('local', 'ldap')) not null, "externalId" varchar(255) null, "password" varchar(255) null, "isActive" boolean not null default false, "lastLoginAt" timestamptz null, "isLicensed" boolean not null default false, "metadata" jsonb null, constraint "users_pkey" primary key ("id"));`);
    this.addSql(`create index "users_tenantId_index" on "users" ("tenantId");`);
    this.addSql(`create index "users_username_index" on "users" ("username");`);
    this.addSql(`alter table "users" add constraint "users_username_unique" unique ("username");`);

    this.addSql(`create table "services" ("id" uuid not null, "code" varchar(255) not null, "name" varchar(200) not null, "description" text null, "longDescription" text null, "ownerUserId" varchar(255) null, "lifecycleStatus" text check ("lifecycleStatus" in ('DRAFT', 'ACTIVE', 'RETIRED')) not null default 'ACTIVE', "createdAt" timestamptz not null, "updatedAt" timestamptz not null, constraint "services_pkey" primary key ("id"));`);
    this.addSql(`alter table "services" add constraint "services_code_unique" unique ("code");`);

    this.addSql(`create table "service_requests" ("id" uuid not null, "requestNumber" varchar(255) not null, "serviceCardId" uuid not null, "serviceId" uuid null, "requesterUserId" varchar(255) not null, "requestedForUserId" varchar(255) null, "currentStatus" varchar(255) not null default 'SUBMITTED', "currentAssigneeUserId" varchar(255) null, "currentAssigneeGroupId" varchar(255) null, "priority" varchar(255) not null default 'NORMAL', "channel" varchar(255) not null default 'Portal', "slaStatus" varchar(255) null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null, "closedAt" date null, constraint "service_requests_pkey" primary key ("id"));`);
    this.addSql(`create index "service_requests_requestNumber_index" on "service_requests" ("requestNumber");`);

    this.addSql(`create table "groups" ("id" varchar(255) not null, "tenantId" varchar(255) not null, "createdAt" timestamptz not null default CURRENT_TIMESTAMP, "updatedAt" timestamptz not null default CURRENT_TIMESTAMP, "isActive" boolean not null default true, "name" varchar(120) not null, "type" varchar(255) not null, "description" varchar(255) null, "teamLeaderId" varchar(255) null, "businessLineId" varchar(255) not null, constraint "groups_pkey" primary key ("id"));`);
    this.addSql(`create index "groups_tenantId_index" on "groups" ("tenantId");`);

    this.addSql(`create table "groups_roles" ("group" varchar(255) not null, "role" varchar(255) not null, constraint "groups_roles_pkey" primary key ("group", "role"));`);

    this.addSql(`create table "groups_permissions" ("group" varchar(255) not null, "permission" uuid not null, constraint "groups_permissions_pkey" primary key ("group", "permission"));`);

    this.addSql(`create table "groups_members" ("group" varchar(255) not null, "user" varchar(255) not null, constraint "groups_members_pkey" primary key ("group", "user"));`);

    this.addSql(`create table "cases" ("id" varchar(255) not null, "tenantId" varchar(255) not null, "createdAt" timestamptz not null default CURRENT_TIMESTAMP, "updatedAt" timestamptz not null default CURRENT_TIMESTAMP, "isActive" boolean not null default true, "number" varchar(30) not null, "title" varchar(50) not null, "description" text null, "status" text check ("status" in ('NEW', 'WAITING_FOR_APPROVAL', 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELED')) not null default 'NEW', "priority" text check ("priority" in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) not null default 'MEDIUM', "category" varchar(255) not null, "subcategory" varchar(255) null, "requesterId" varchar(255) not null, "assigneeId" varchar(255) null, "assignmentGroupId" varchar(255) not null, "businessLineId" varchar(255) not null, "affectedServiceId" uuid not null, "requestCardId" uuid null, constraint "cases_pkey" primary key ("id"));`);
    this.addSql(`create index "cases_tenantId_index" on "cases" ("tenantId");`);
    this.addSql(`create index "cases_number_index" on "cases" ("number");`);

    this.addSql(`create table "sla_timers" ("id" varchar(255) not null, "caseId" varchar(255) not null, "targetId" varchar(255) not null, "createdAt" timestamptz not null default CURRENT_TIMESTAMP, "startedAt" timestamptz not null, "stoppedAt" timestamptz null, "breachedAt" timestamptz null, "lastTickAt" timestamptz null, "remainingMs" int not null, "status" varchar(255) not null default 'Running', "pausedAt" timestamptz null, "resumedAt" timestamptz null, "totalPausedMs" int not null default 0, constraint "sla_timers_pkey" primary key ("id"));`);
    this.addSql(`create index "sla_timers_caseId_targetId_index" on "sla_timers" ("caseId", "targetId");`);

    this.addSql(`create table "case_comments" ("id" varchar(255) not null, "tenantId" varchar(255) not null, "createdAt" timestamptz not null default CURRENT_TIMESTAMP, "updatedAt" timestamptz not null default CURRENT_TIMESTAMP, "isActive" boolean not null default true, "caseId" varchar(255) not null, "body" text not null, "isPrivate" boolean not null default true, constraint "case_comments_pkey" primary key ("id"));`);
    this.addSql(`create index "case_comments_tenantId_index" on "case_comments" ("tenantId");`);
    this.addSql(`create index "case_comments_caseId_createdAt_index" on "case_comments" ("caseId", "createdAt");`);

    this.addSql(`create table "case_attachments" ("id" varchar(255) not null, "tenantId" varchar(255) not null, "createdAt" timestamptz not null default CURRENT_TIMESTAMP, "updatedAt" timestamptz not null default CURRENT_TIMESTAMP, "isActive" boolean not null default true, "caseId" varchar(255) not null, "filename" varchar(255) not null, "originalName" varchar(255) not null, "mimeType" varchar(255) not null, "size" int not null, "storagePath" varchar(255) not null, constraint "case_attachments_pkey" primary key ("id"));`);
    this.addSql(`create index "case_attachments_tenantId_index" on "case_attachments" ("tenantId");`);

    this.addSql(`create table "users_permissions" ("user" varchar(255) not null, "permission" uuid not null, constraint "users_permissions_pkey" primary key ("user", "permission"));`);

    this.addSql(`create table "users_roles" ("user" varchar(255) not null, "role" varchar(255) not null, constraint "users_roles_pkey" primary key ("user", "role"));`);

    this.addSql(`alter table "service_categories" add constraint "service_categories_parent_foreign" foreign key ("parent") references "service_categories" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "service_form_schemas" add constraint "service_form_schemas_card_foreign" foreign key ("card") references "service_cards" ("id") on update cascade;`);

    this.addSql(`alter table "sub_categories" add constraint "sub_categories_tenantId_foreign" foreign key ("tenantId") references "tenants" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "sla_targets" add constraint "sla_targets_tenantId_foreign" foreign key ("tenantId") references "tenants" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "roles" add constraint "roles_tenantId_foreign" foreign key ("tenantId") references "tenants" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "roles_permissions" add constraint "roles_permissions_role_foreign" foreign key ("role") references "roles" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "roles_permissions" add constraint "roles_permissions_permission_foreign" foreign key ("permission") references "permissions" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "departments" add constraint "departments_tenantId_foreign" foreign key ("tenantId") references "tenants" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "categories" add constraint "categories_tenantId_foreign" foreign key ("tenantId") references "tenants" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "categories_subCategories" add constraint "categories_subCategories_category_foreign" foreign key ("category") references "categories" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "categories_subCategories" add constraint "categories_subCategories_subCategory_foreign" foreign key ("subCategory") references "sub_categories" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "business_lines" add constraint "business_lines_tenantId_foreign" foreign key ("tenantId") references "tenants" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "audit_logs" add constraint "audit_logs_tenantId_foreign" foreign key ("tenantId") references "tenants" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "users" add constraint "users_tenantId_foreign" foreign key ("tenantId") references "tenants" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "users" add constraint "users_department_foreign" foreign key ("department") references "departments" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "services" add constraint "services_ownerUserId_foreign" foreign key ("ownerUserId") references "users" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "service_requests" add constraint "service_requests_serviceCardId_foreign" foreign key ("serviceCardId") references "service_cards" ("id") on update cascade;`);
    this.addSql(`alter table "service_requests" add constraint "service_requests_serviceId_foreign" foreign key ("serviceId") references "services" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "groups" add constraint "groups_tenantId_foreign" foreign key ("tenantId") references "tenants" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "groups" add constraint "groups_teamLeaderId_foreign" foreign key ("teamLeaderId") references "users" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "groups" add constraint "groups_businessLineId_foreign" foreign key ("businessLineId") references "business_lines" ("id") on update cascade;`);

    this.addSql(`alter table "groups_roles" add constraint "groups_roles_group_foreign" foreign key ("group") references "groups" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "groups_roles" add constraint "groups_roles_role_foreign" foreign key ("role") references "roles" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "groups_permissions" add constraint "groups_permissions_group_foreign" foreign key ("group") references "groups" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "groups_permissions" add constraint "groups_permissions_permission_foreign" foreign key ("permission") references "permissions" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "groups_members" add constraint "groups_members_group_foreign" foreign key ("group") references "groups" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "groups_members" add constraint "groups_members_user_foreign" foreign key ("user") references "users" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "cases" add constraint "cases_tenantId_foreign" foreign key ("tenantId") references "tenants" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "cases" add constraint "cases_category_foreign" foreign key ("category") references "categories" ("id") on update cascade;`);
    this.addSql(`alter table "cases" add constraint "cases_subcategory_foreign" foreign key ("subcategory") references "categories" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "cases" add constraint "cases_requesterId_foreign" foreign key ("requesterId") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "cases" add constraint "cases_assigneeId_foreign" foreign key ("assigneeId") references "users" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "cases" add constraint "cases_assignmentGroupId_foreign" foreign key ("assignmentGroupId") references "groups" ("id") on update cascade;`);
    this.addSql(`alter table "cases" add constraint "cases_businessLineId_foreign" foreign key ("businessLineId") references "business_lines" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "cases" add constraint "cases_affectedServiceId_foreign" foreign key ("affectedServiceId") references "services" ("id") on update cascade;`);
    this.addSql(`alter table "cases" add constraint "cases_requestCardId_foreign" foreign key ("requestCardId") references "service_cards" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "sla_timers" add constraint "sla_timers_caseId_foreign" foreign key ("caseId") references "cases" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "sla_timers" add constraint "sla_timers_targetId_foreign" foreign key ("targetId") references "sla_targets" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "case_comments" add constraint "case_comments_tenantId_foreign" foreign key ("tenantId") references "tenants" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "case_comments" add constraint "case_comments_caseId_foreign" foreign key ("caseId") references "cases" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "case_attachments" add constraint "case_attachments_tenantId_foreign" foreign key ("tenantId") references "tenants" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "case_attachments" add constraint "case_attachments_caseId_foreign" foreign key ("caseId") references "cases" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "users_permissions" add constraint "users_permissions_user_foreign" foreign key ("user") references "users" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "users_permissions" add constraint "users_permissions_permission_foreign" foreign key ("permission") references "permissions" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "users_roles" add constraint "users_roles_user_foreign" foreign key ("user") references "users" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "users_roles" add constraint "users_roles_role_foreign" foreign key ("role") references "roles" ("id") on update cascade on delete cascade;`);
  }

}
