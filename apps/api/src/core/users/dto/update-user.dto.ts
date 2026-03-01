import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { AuthSource } from '../constants/auth-source.constant';

export class UpdateUserDto {
  @ApiProperty({ example: 'John', required: false })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiProperty({ example: 'johndoe', required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ example: 'johndoe@example.com', required: false })
  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  email?: string;

  @ApiProperty({ example: 'avatar.png', required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: '1234567890', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'johndoe@example.com', required: false })
  @IsString()
  @IsOptional()
  manager?: string;

  @ApiProperty({ example: 'ldap', required: false })
  @IsString()
  @IsOptional()
  auth_source?: AuthSource;

  @ApiProperty({ example: 'IT', required: false })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty({ example: '123456', required: false })
  @IsString()
  @IsOptional()
  external_id?: string;

  @ApiProperty({ example: 'password', required: false })
  @IsStrongPassword()
  @IsOptional()
  password?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  is_licensed?: boolean;

  @ApiProperty({ example: { phone: '1234567890' }, required: false })
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

  @ApiProperty({ example: ['uuid-1', 'uuid-2'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @ApiProperty({ example: ['uuid-1', 'uuid-2'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];

  @ApiProperty({ example: ['uuid-1', 'uuid-2'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  groups?: string[];
}
