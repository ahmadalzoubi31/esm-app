import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray } from 'class-validator';
import { RoleDto } from '@repo/shared';
import { TenantBaseDto } from '../../../common/dtos/tenant-base.dto';

export class CreateRoleDto extends TenantBaseDto implements RoleDto {
  @ApiProperty({
    description: 'Role name',
    example: 'Admin',
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    description: 'Role description',
    example: 'Admin role',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Array of permission IDs',
    example: ['123', '456'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissionIds?: string[];
}
