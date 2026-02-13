import { Migration } from '@mikro-orm/migrations';

export class Migration20260210122751 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "tenant" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`,
    );
    this.addSql(
      `alter table "tenant" alter column "created_at" drop not null;`,
    );
    this.addSql(
      `alter table "tenant" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`,
    );
    this.addSql(
      `alter table "tenant" alter column "updated_at" drop not null;`,
    );
    this.addSql(
      `alter table "tenant" add constraint "tenant_name_unique" unique ("name");`,
    );
    this.addSql(
      `alter table "tenant" add constraint "tenant_slug_unique" unique ("slug");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tenant" drop constraint "tenant_name_unique";`);
    this.addSql(`alter table "tenant" drop constraint "tenant_slug_unique";`);

    this.addSql(
      `alter table "tenant" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`,
    );
    this.addSql(`alter table "tenant" alter column "created_at" set not null;`);
    this.addSql(
      `alter table "tenant" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`,
    );
    this.addSql(`alter table "tenant" alter column "updated_at" set not null;`);
  }
}
