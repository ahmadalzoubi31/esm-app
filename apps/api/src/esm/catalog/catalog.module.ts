import { Module } from '@nestjs/common';
import { ServicesModule } from './services/services.module';
import { ServiceCategoriesModule } from './service-categories/service-categories.module';
import { FormSchemasModule } from './form-schemas/form-schemas.module';
import { ServiceCardsModule } from './service-cards/service-cards.module';

@Module({
  imports: [ServicesModule, ServiceCategoriesModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class CatalogModule {}
