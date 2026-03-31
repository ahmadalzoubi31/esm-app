import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray } from 'class-validator';
import { RoleDto } from '@repo/shared';

export class CreateRoleDto implements RoleDto {
  @ApiProperty({
    description: 'Role name',
    example: 'Admin',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Admin role',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Array of permission IDs',
    example: ['123', '456'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissionIds: string[];
}
