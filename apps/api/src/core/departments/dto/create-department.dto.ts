import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { DepartmentDto } from '@repo/shared';

export class CreateDepartmentDto implements DepartmentDto {
  @ApiProperty({ example: 'Human Resources' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Manages employee relations' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  active: boolean = true;
}
