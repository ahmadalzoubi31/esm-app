import { Migration } from '@mikro-orm/migrations';

export class Migration20260328102802 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop index "sla_targets_key_index";`);

    this.addSql(`alter table "sla_targets" rename column "key" to "type";`);
    this.addSql(`create index "sla_targets_name_index" on "sla_targets" ("name");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index "sla_targets_name_index";`);

    this.addSql(`alter table "sla_targets" rename column "type" to "key";`);
    this.addSql(`create index "sla_targets_key_index" on "sla_targets" ("key");`);
  }

}
