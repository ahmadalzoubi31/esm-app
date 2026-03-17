import { Module } from '@nestjs/common';
import { CatalogModule } from './catalog/catalog.module';
import { CasesModule } from './cases/cases.module';

@Module({
  imports: [CasesModule, CatalogModule],
  providers: [],
  exports: [],
})
export class EsmModule {}
