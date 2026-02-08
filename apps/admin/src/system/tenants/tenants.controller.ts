import { Body, Controller, Post } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { Tenant } from './tenant.entity';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a tenant',
    description: 'Create a new tenant.',
  })
  @ApiResponse({
    status: 201,
    description: 'The tenant has been successfully created.',
    type: Tenant,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.createTenant(createTenantDto);
  }
}
