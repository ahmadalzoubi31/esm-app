import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { CategoryDto } from '@repo/shared';
import { TenantBaseDto } from 'src/common/dtos/tenant-base.dto';

export class CreateCategoryDto extends TenantBaseDto implements CategoryDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Category tier level (1 for category, 2 for subcategory)',
    default: 1,
  })
  @IsNumber()
  tier: number = 1;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  parentId?: string;
}
