import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword, IsUUID } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'user_id' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ example: 'password' })
  @IsStrongPassword()
  password: string;
}
