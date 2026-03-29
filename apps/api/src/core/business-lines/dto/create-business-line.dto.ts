import { BusinessLineDto } from '@repo/shared';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateBusinessLineDto implements BusinessLineDto {
  @IsString()
  key: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  isActive: boolean;
}
