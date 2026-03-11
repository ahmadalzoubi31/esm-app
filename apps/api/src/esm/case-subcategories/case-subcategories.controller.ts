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
import { CaseSubcategoriesService } from './case-subcategories.service';
import { CreateCaseSubcategoryDto } from './dto/create-case-subcategory.dto';
import { UpdateCaseSubcategoryDto } from './dto/update-case-subcategory.dto';

@ApiTags('Case Subcategories')
@ApiBearerAuth()
@Controller('case-subcategories')
export class CaseSubcategoriesController {
  constructor(
    private readonly caseSubcategoriesService: CaseSubcategoriesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Case Subcategory' })
  @ApiResponse({
    status: 201,
    description: 'The case subcategory has been successfully created.',
  })
  create(@Body() createDto: CreateCaseSubcategoryDto) {
    return this.caseSubcategoriesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Case Subcategories' })
  findAll() {
    return this.caseSubcategoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific Case Subcategory by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.caseSubcategoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific Case Subcategory' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateCaseSubcategoryDto,
  ) {
    return this.caseSubcategoriesService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific Case Subcategory' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.caseSubcategoriesService.remove(id);
  }
}
