import { GROUP_TYPE_ENUM } from '../constants/group-type.constant';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({ example: 'Network' })
  @IsString()
  name: string;

  @ApiProperty({ example: GROUP_TYPE_ENUM.TIER_1 })
  @IsEnum(GROUP_TYPE_ENUM)
  type: GROUP_TYPE_ENUM;

  @ApiProperty({ example: 'Network Team Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'TeamLeader ID' })
  @IsString()
  @IsOptional()
  teamLeaderId?: string;

  @ApiProperty({ example: 'Business Line ID' })
  @IsString()
  businessLineId: string;

  @ApiProperty({ example: 'Business Line Key' })
  @IsString()
  businessLineKey: string;
}
