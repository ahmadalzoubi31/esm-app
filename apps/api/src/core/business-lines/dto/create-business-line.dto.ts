import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { TenantBaseDto } from '../../../common/dtos/tenant-base.dto';
import { BusinessLineDto } from '@repo/shared';

export class CreateBusinessLineDto
  extends TenantBaseDto
  implements BusinessLineDto
{
  @ApiProperty({
    description: 'Name of the business line',
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}
