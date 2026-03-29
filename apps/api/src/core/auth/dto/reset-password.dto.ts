import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword, IsUUID } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'userId' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'password' })
  @IsStrongPassword()
  password: string;
}
