import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateCaseAttachmentDto {
  @ApiProperty()
  @IsUUID()
  caseId!: string;

  @ApiProperty()
  @IsString()
  filename!: string;

  @ApiProperty()
  @IsString()
  originalName!: string;

  @ApiProperty()
  @IsString()
  mimeType!: string;

  @ApiProperty()
  @IsNumber()
  size!: number;

  @ApiProperty()
  @IsUUID()
  createdById!: string;

  @ApiProperty()
  @IsString()
  createdByName!: string;

  @ApiProperty()
  @IsString()
  storagePath!: string;
}
