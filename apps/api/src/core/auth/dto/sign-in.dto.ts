import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'system' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'P@ssw0rd' })
  @IsNotEmpty()
  password: string;
}
