import { IsObject, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionsToUserDto {
  @ApiProperty({
    format: 'uuid',
    description: 'Permission IDs to grant to user.',
  })
  @IsUUID('4', { each: true })
  permissionIds!: string[];
}
