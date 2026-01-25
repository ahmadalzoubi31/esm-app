import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
export class CreatePermissionDto {
  @ApiProperty({
    description: 'Unique permission key',
    example: 'case:read:own',
  })
  @IsString()
  key: string;

  @ApiProperty({
    description: 'Subject/resource this permission applies to',
    example: 'Case',
  })
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Action allowed on the subject',
    example: 'read',
  })
  @IsString()
  action: string;

  @ApiProperty({
    description: 'Category for grouping permissions',
    example: 'Case Management',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Human-readable description',
    example: 'Read own cases',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Conditions for this permission (ABAC)',
    example: { field: 'requesterId', op: 'eq', value: '$user.id' },
    required: false,
  })
  @IsObject()
  @IsOptional()
  conditions?: Record<string, any>;
}
