import { Injectable } from '@nestjs/common';
import { CreateFormSchemaDto } from './dto/create-form-schema.dto';
import { UpdateFormSchemaDto } from './dto/update-form-schema.dto';

@Injectable()
export class FormSchemasService {
  create(createFormSchemaDto: CreateFormSchemaDto) {
    return 'This action adds a new formSchema';
  }

  findAll() {
    return `This action returns all formSchemas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} formSchema`;
  }

  update(id: number, updateFormSchemaDto: UpdateFormSchemaDto) {
    return `This action updates a #${id} formSchema`;
  }

  remove(id: number) {
    return `This action removes a #${id} formSchema`;
  }
}
