import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SubcategoriesService } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@ApiTags('Subcategories')
@ApiBearerAuth()
@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Subcategory' })
  @ApiResponse({
    status: 201,
    description: 'The subcategory has been successfully created.',
  })
  create(@Body() createDto: CreateSubcategoryDto) {
    return this.subcategoriesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Subcategories' })
  findAll(@Query('categoryId') categoryId?: string) {
    return this.subcategoriesService.findAll(categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific Subcategory by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.subcategoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific Subcategory' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoriesService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific Subcategory' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.subcategoriesService.remove(id);
  }
}
