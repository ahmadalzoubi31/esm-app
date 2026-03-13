import { Migration } from '@mikro-orm/migrations';

export class Migration20260312110227 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "cases" drop constraint "cases_affected_service_id_foreign";`);

    this.addSql(`alter table "cases" alter column "affected_service_id" drop default;`);
    this.addSql(`alter table "cases" alter column "affected_service_id" type uuid using ("affected_service_id"::text::uuid);`);
    this.addSql(`alter table "cases" alter column "affected_service_id" drop not null;`);
    this.addSql(`alter table "cases" add constraint "cases_affected_service_id_foreign" foreign key ("affected_service_id") references "services" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "cases" drop constraint "cases_affected_service_id_foreign";`);

    this.addSql(`alter table "cases" alter column "affected_service_id" drop default;`);
    this.addSql(`alter table "cases" alter column "affected_service_id" type uuid using ("affected_service_id"::text::uuid);`);
    this.addSql(`alter table "cases" alter column "affected_service_id" set not null;`);
    this.addSql(`alter table "cases" add constraint "cases_affected_service_id_foreign" foreign key ("affected_service_id") references "services" ("id") on update cascade;`);
  }

}
