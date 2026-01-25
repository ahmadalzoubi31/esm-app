import { Module } from '@nestjs/common';
import { CatalogModule } from './catalog/catalog.module';

@Module({
  imports: [CatalogModule],
  providers: [],
  exports: [],
})
export class EsmModule {}
