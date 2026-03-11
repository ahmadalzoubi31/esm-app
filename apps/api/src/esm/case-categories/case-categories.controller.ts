import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CaseCategoriesService } from './case-categories.service';
import { CreateCaseCategoryDto } from './dto/create-case-category.dto';
import { UpdateCaseCategoryDto } from './dto/update-case-category.dto';

@ApiTags('Case Categories')
@ApiBearerAuth()
@Controller('case-categories')
export class CaseCategoriesController {
  constructor(private readonly caseCategoriesService: CaseCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Case Category' })
  @ApiResponse({
    status: 201,
    description: 'The case category has been successfully created.',
  })
  create(@Body() createDto: CreateCaseCategoryDto) {
    return this.caseCategoriesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Case Categories' })
  findAll() {
    return this.caseCategoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific Case Category by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.caseCategoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific Case Category' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateCaseCategoryDto,
  ) {
    return this.caseCategoriesService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific Case Category' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.caseCategoriesService.remove(id);
  }
}
