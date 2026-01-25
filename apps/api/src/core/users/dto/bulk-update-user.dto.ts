import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

export class BulkUpdateUserDto {
  @ApiProperty({
    description: 'Array of user IDs to update',
    example: ['uuid-1', 'uuid-2', 'uuid-3'],
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  ids: string[];

  @ApiProperty({
    description: 'Data to update for all specified users',
    type: UpdateUserDto,
  })
  @ValidateNested()
  @Type(() => UpdateUserDto)
  @IsNotEmpty()
  data: UpdateUserDto;
}
