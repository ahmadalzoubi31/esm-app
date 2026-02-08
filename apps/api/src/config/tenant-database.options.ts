import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

export const tenantOrmBaseOptions: Options<PostgreSqlDriver> = {
  driver: PostgreSqlDriver,
  highlighter: new SqlHighlighter(),
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  metadataProvider: TsMorphMetadataProvider,
  debug: process.env.NODE_ENV !== 'production',
};
