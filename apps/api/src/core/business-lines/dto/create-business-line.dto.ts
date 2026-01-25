import { IsString, IsOptional } from 'class-validator';

export class CreateBusinessLineDto {
  @IsString()
  key: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
