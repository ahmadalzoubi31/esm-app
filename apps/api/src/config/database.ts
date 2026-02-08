import { defineConfig } from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Migrator } from '@mikro-orm/migrations';
import { EntityGenerator } from '@mikro-orm/entity-generator';
import { SeedManager } from '@mikro-orm/seeder';
import { registerAs } from '@nestjs/config';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { ServiceSubscriber } from '../esm/catalog/services/subscribers/service.subscriber';
import 'dotenv/config';

export const databaseConfig = registerAs('database', () =>
  defineConfig({
    highlighter: new SqlHighlighter(),
    clientUrl: process.env.DATABASE_URL,
    // folder-based discovery setup, using common filename suffix
    entities: ['./dist/**/*.entity.js'],
    entitiesTs: ['./src/**/*.entity.ts'],
    // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
    // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
    metadataProvider: TsMorphMetadataProvider,
    // enable debug mode to log SQL queries and discovery information
    debug: false,
    // Enable extensions
    extensions: [Migrator, EntityGenerator, SeedManager],

    // Subscribers configuration - register event subscribers
    subscribers: [new ServiceSubscriber()],

    // Migrations configuration
    migrations: {
      path: './dist/common/libs/database/migrations', // path to the folder with migrations
      pathTs: './src/common/libs/database/migrations', // path to the folder with TS migrations (if used, you should put path to compiled files in `path`)
    },

    // Seeder configuration
    seeder: {
      path: './dist/common/libs/database/seeders', // path to the folder with seeders
      pathTs: './src/common/libs/database/seeders', // path to the folder with TS seeders (if used, you should put path to compiled files in `path`)
      defaultSeeder: 'DatabaseSeeder', // default seeder class name
      glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
      emit: 'ts', // seeder generation mode
      fileName: (className: string) => className, // seeder file naming convention
    },
  }),
);
