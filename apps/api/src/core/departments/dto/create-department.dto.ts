import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { DepartmentDto } from '@repo/shared';
import { TenantBaseDto } from 'src/common/dtos/tenant-base.dto';

export class CreateDepartmentDto
  extends TenantBaseDto
  implements DepartmentDto
{
  @ApiProperty({ example: 'Human Resources' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Manages employee relations' })
  @IsString()
  @IsOptional()
  description?: string;
}
