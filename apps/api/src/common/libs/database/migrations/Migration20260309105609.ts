import { Migration } from '@mikro-orm/migrations';

export class Migration20260309105609 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "groups" drop column "business_line_key";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "groups" add column "business_line_key" varchar(255) not null;`);
  }

}
