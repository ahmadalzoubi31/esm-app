import { defineConfig } from '@mikro-orm/sqlite';
import { Migrator } from '@mikro-orm/migrations';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { registerAs } from '@nestjs/config';

export const systemDatabaseConfig = registerAs('systemDatabase', () =>
  defineConfig({
    highlighter: new SqlHighlighter(),
    dbName: 'system.db',
    entities: ['./dist/src/system/**/*.entity.js'],
    entitiesTs: ['./src/system/**/*.entity.ts'],
    metadataProvider: TsMorphMetadataProvider,
    extensions: [Migrator],
    migrations: {
      path: './dist/common/libs/database/migrations', // path to the folder with migrations
      pathTs: './src/common/libs/database/migrations', // path to the folder with TS migrations (if used, you should put path to compiled files in `path`)
    },
  }),
);
