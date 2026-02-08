import { Migration } from '@mikro-orm/migrations';

export class Migration20260208185041 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`tenants\` (\`id\` text not null, \`name\` text not null, \`code\` text not null, \`database_url\` text not null, \`is_active\` integer not null default true, \`created_at\` datetime not null, \`updated_at\` datetime not null, primary key (\`id\`));`);
    this.addSql(`create unique index \`tenants_code_unique\` on \`tenants\` (\`code\`);`);
  }

}
