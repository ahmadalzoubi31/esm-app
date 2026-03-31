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

export class CreateCategoryDto implements CategoryDto {
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

  @ApiPropertyOptional({
    description: 'UUID of the parent category if tier > 1',
  })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;
}
