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
import { AuthSource } from '../constants/auth-source.constant';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  last_name: string;

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
  auth_source: AuthSource;

  @ApiProperty({ example: 'IT' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsOptional()
  external_id?: string;

  @ApiProperty({ example: 'password' })
  @IsStrongPassword()
  @IsOptional()
  password?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  is_licensed: boolean;

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
