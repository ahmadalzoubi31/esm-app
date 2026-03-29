// src/modules/sla/dto/create-target.dto.ts (admin)
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import type { SlaTargetDto, SlaType } from '@repo/shared';
import { SlaTargetRulesDto } from './sla-target-rules.dto';

export class SlaTargetWriteDto implements SlaTargetDto {
  @ApiProperty({ example: 'respond' })
  @IsEnum(['respond', 'resolution'])
  type!: SlaType;

  @ApiProperty({ example: 'Respond in 4h' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Respond in 4h' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 14400000 })
  @IsInt()
  @Min(1)
  goalMs!: number; // e.g., 14400000

  @ApiProperty({
    type: SlaTargetRulesDto,
    example: {
      startTriggers: [{ event: 'case.created', action: 'start' }],
      stopTriggers: [
        {
          event: 'case.status.changed',
          conditions: [
            { field: 'status', operator: 'not_equals', value: '$null$' },
          ],
          action: 'stop',
        },
      ],
      pauseTriggers: [
        {
          event: 'case.status.changed',
          conditions: [
            { field: 'status', operator: 'equals', value: 'Pending' },
          ],
          action: 'pause',
        },
      ],
      resumeTriggers: [
        {
          event: 'case.status.changed',
          conditions: [
            { field: 'status', operator: 'equals', value: 'InProgress' },
          ],
          action: 'resume',
        },
      ],
    },
  })
  @ValidateNested()
  @Type(() => SlaTargetRulesDto)
  rules!: SlaTargetRulesDto;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  isActive: boolean = true;
}
