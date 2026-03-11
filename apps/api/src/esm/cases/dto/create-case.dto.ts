import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { CaseStatus } from '../constants/case-status.constant';
import { CasePriority } from '../constants/case-priority.constant';

export class CreateCaseDto {
  @ApiProperty({ maxLength: 200 })
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: CaseStatus, default: CaseStatus.NEW })
  @IsEnum(CaseStatus)
  @IsOptional()
  status?: CaseStatus;

  @ApiPropertyOptional({ enum: CasePriority, default: CasePriority.MEDIUM })
  @IsEnum(CasePriority)
  @IsOptional()
  priority?: CasePriority;

  @ApiProperty({ description: 'UUID of the Case Category' })
  @IsUUID()
  categoryId!: string;

  @ApiPropertyOptional({ description: 'UUID of the Case Subcategory' })
  @IsUUID()
  @IsOptional()
  subcategoryId?: string;

  @ApiProperty({ description: 'UUID of the requester User' })
  @IsUUID()
  requesterId!: string;

  @ApiPropertyOptional({ description: 'UUID of the assignee User' })
  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @ApiProperty({ description: 'UUID of the assignment Group' })
  @IsUUID()
  assignmentGroupId!: string;

  @ApiProperty({ description: 'UUID of the Business Line' })
  @IsUUID()
  businessLineId!: string;

  @ApiProperty({ description: 'UUID of the affected Service' })
  @IsUUID()
  affectedServiceId!: string;

  @ApiPropertyOptional({ description: 'UUID of the request Service Card' })
  @IsUUID()
  @IsOptional()
  requestCardId?: string;
}
