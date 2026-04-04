import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsObject,
  IsUUID,
} from 'class-validator';

export class CreateServiceCardDto {
  @IsUUID()
  @IsOptional()
  serviceId?: string;

  @IsString()
  displayTitle: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  colorTheme?: string;

  @IsNumber()
  @IsOptional()
  displayOrder?: number;

  @IsArray()
  @IsOptional()
  badges?: string[];

  @IsBoolean()
  @IsOptional()
  isRequestable?: boolean;

  @IsString()
  @IsOptional()
  workflowId?: string;

  @IsObject()
  @IsOptional()
  expectedSla?: {
    responseMinutes?: number;
    resolutionMinutes?: number;
  };

  @IsObject()
  @IsOptional()
  visibilityRules?: {
    roles?: string[];
    groups?: string[];
    businessLines?: string[];
  };
}
