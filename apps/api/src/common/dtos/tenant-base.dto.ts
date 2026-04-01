import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate } from 'class-validator';

export class TenantBaseDto {
  @ApiProperty()
  @IsBoolean()
  isActive: boolean = true;

  @IsDate()
  createdAt: Date = new Date();

  @IsDate()
  updatedAt: Date = new Date();
}
