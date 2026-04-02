import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  IsUUID,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { SubCategoryDto } from '@repo/shared';
import { TenantBaseDto } from 'src/common/dtos/tenant-base.dto';

export class CreateSubCategoryDto
  extends TenantBaseDto
  implements SubCategoryDto
{
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
