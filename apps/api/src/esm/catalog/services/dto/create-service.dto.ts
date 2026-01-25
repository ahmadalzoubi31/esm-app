import { ServiceCard } from '../../service-cards/entities/service-card.entity';
import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';

export enum ServiceLifecycleStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  RETIRED = 'RETIRED',
}

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  longDescription?: string;

  // @IsUUID()
  // categoryId: string;

  // @IsUUID()
  // @IsOptional()
  // ownerGroupId?: string;

  // @IsUUID()
  // @IsOptional()
  // ownerUserId?: string;

  // @IsUUID()
  // @IsOptional()
  // businessLineId?: string;

  @IsEnum(ServiceLifecycleStatus)
  @IsOptional()
  lifecycleStatus?: ServiceLifecycleStatus;
}
