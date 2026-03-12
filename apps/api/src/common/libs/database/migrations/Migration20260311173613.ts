import { Migration } from '@mikro-orm/migrations';

export class Migration20260311173613 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "case_subcategories" drop constraint "case_subcategories_categoryId_foreign";`);

    this.addSql(`alter table "case_subcategories" rename column "categoryId" to "category_id";`);
    this.addSql(`alter table "case_subcategories" add constraint "case_subcategories_category_id_foreign" foreign key ("category_id") references "case_categories" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "case_subcategories" drop constraint "case_subcategories_category_id_foreign";`);

    this.addSql(`alter table "case_subcategories" rename column "category_id" to "categoryId";`);
    this.addSql(`alter table "case_subcategories" add constraint "case_subcategories_categoryId_foreign" foreign key ("categoryId") references "case_categories" ("id") on update cascade;`);
  }

}
