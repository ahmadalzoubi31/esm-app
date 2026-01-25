import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FormSchemasService } from './form-schemas.service';
import { CreateFormSchemaDto } from './dto/create-form-schema.dto';
import { UpdateFormSchemaDto } from './dto/update-form-schema.dto';

@Controller('form-schemas')
export class FormSchemasController {
  constructor(private readonly formSchemasService: FormSchemasService) {}

  @Post()
  create(@Body() createFormSchemaDto: CreateFormSchemaDto) {
    return this.formSchemasService.create(createFormSchemaDto);
  }

  @Get()
  findAll() {
    return this.formSchemasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formSchemasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormSchemaDto: UpdateFormSchemaDto) {
    return this.formSchemasService.update(+id, updateFormSchemaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formSchemasService.remove(+id);
  }
}
