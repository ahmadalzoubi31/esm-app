import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTenantsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsOptional()
  preferences?: Record<string, any>;
}
