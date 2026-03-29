import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  GroupTypeEnumSchema,
  type GroupDto,
  type GroupType,
} from '@repo/shared';
import { Role } from 'src/core/roles/entities/role.entity';
import { Permission } from 'src/core/permissions/entities/permission.entity';
import { User } from 'src/core/users/entities/user.entity';

export class CreateGroupDto implements GroupDto {
  @ApiProperty({ example: 'Network' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'TIER_1' })
  @IsEnum(GroupTypeEnumSchema)
  type: GroupType;

  @ApiProperty({ example: 'Network Team Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'TeamLeader ID' })
  @IsString()
  @IsOptional()
  teamLeaderId?: string;

  @ApiProperty({ example: 'Department ID' })
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiProperty({ example: 'Business Line ID' })
  @IsString()
  businessLineId: string;

  @ApiProperty({ example: ['uuid-1', 'uuid-2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @ApiProperty({ example: ['uuid-1', 'uuid-2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: Permission[];

  @ApiProperty({ example: ['uuid-1', 'uuid-2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  users?: User[];
}
