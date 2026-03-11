import { PartialType } from '@nestjs/swagger';
import { CreateCaseSubcategoryDto } from './create-case-subcategory.dto';

export class UpdateCaseSubcategoryDto extends PartialType(
  CreateCaseSubcategoryDto,
) {}
