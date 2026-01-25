import { Migration } from '@mikro-orm/migrations';

export class Migration20260121194202 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" add column "department" varchar(255) null, add column "phone" varchar(255) null, add column "manager" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" drop column "department", drop column "phone", drop column "manager";`);
  }

}
