import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
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
}
