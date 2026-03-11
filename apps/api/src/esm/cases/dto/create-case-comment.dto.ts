import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateCaseCommentDto {
  @ApiProperty()
  @IsUUID()
  caseId!: string;

  @ApiProperty()
  @IsString()
  body!: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isPrivate: boolean;
}
