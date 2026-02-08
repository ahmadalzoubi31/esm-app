import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Services')
@ApiBearerAuth()
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new service',
    description: 'Create a new service',
  })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all services',
    description: 'Find all services',
  })
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find a service by id',
    description: 'Find a service by id',
  })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a service by id',
    description: 'Update a service by id',
  })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a service by id',
    description: 'Delete a service by id',
  })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
