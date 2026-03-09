import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateBusinessLineDto {
  @IsString()
  key: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
