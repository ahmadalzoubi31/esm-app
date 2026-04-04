import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateServiceCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  parentCategoryId?: string;
}
