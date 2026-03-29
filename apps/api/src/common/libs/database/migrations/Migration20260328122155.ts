import { Migration } from '@mikro-orm/migrations';

export class Migration20260328122155 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "sla_targets" add column "description" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "sla_targets" drop column "description";`);
  }

}
