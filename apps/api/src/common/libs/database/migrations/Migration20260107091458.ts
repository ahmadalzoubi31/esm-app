import { Migration } from '@mikro-orm/migrations';

export class Migration20260107091458 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "refresh_token" add column "revoked_at" timestamptz null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "refresh_token" drop column "revoked_at";`);
  }

}
