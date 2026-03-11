import { PartialType } from '@nestjs/swagger';
import { CreateCaseCategoryDto } from './create-case-category.dto';

export class UpdateCaseCategoryDto extends PartialType(CreateCaseCategoryDto) {}
