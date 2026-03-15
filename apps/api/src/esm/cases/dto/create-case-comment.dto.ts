import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateCaseCommentDto {
  @ApiProperty()
  @IsString()
  body!: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  isPrivate: boolean;
}
