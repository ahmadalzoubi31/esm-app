import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  GroupTypeEnumSchema,
  type GroupDto,
  type GroupType,
} from '@repo/shared';
import { TenantBaseDto } from '../../../common/dtos/tenant-base.dto';

export class CreateGroupDto extends TenantBaseDto implements GroupDto {
  @ApiProperty({ example: 'Network' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'TIER_1' })
  @IsEnum(GroupTypeEnumSchema)
  type!: GroupType;

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
  businessLineId!: string;

  @ApiProperty({ example: ['uuid-1', 'uuid-2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roleIds?: string[];

  @ApiProperty({ example: ['uuid-1', 'uuid-2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionIds?: string[];

  @ApiProperty({ example: ['uuid-1', 'uuid-2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memberIds?: string[];
}
