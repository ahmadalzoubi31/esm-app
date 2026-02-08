import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateTenantDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Tenant Name', required: true })
  name!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Code must only contain lowercase letters, numbers, and hyphens',
  })
  @ApiProperty({ example: 'tenant-name', required: true })
  code!: string;
}
