import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { AuthSource, UserDto } from '@repo/shared';

export class CreateUserDto implements UserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'johndoe' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'avatar.png' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @IsString()
  @IsOptional()
  manager?: string;

  @ApiProperty({ example: 'ldap' })
  @IsString()
  authSource: AuthSource;

  @ApiProperty({ example: 'IT' })
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsOptional()
  externalId?: string;

  @ApiProperty({ example: 'password' })
  @IsStrongPassword()
  @IsOptional()
  password?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  isLicensed: boolean;

  @ApiProperty({ example: { phone: '1234567890' } })
  @IsObject()
  @IsOptional()
  metadata?: {
    mobile?: string;
    title?: string;
    company?: string;
    employeeId?: string;
    employeeType?: string;
    location?: string;
    city?: string;
    state?: string;
    country?: string;
    userPrincipalName?: string;
    [key: string]: any;
  };

  @ApiProperty({ example: ['uuid-1', 'uuid-2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @ApiProperty({ example: ['uuid-1', 'uuid-2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];

  @ApiProperty({ example: ['uuid-1', 'uuid-2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  groups?: string[];
}
