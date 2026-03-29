import { IsObject, IsString, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { AssignUserPermissionsDto } from '@repo/shared';

export class AssignPermissionsToUserDto implements AssignUserPermissionsDto {

  @ApiProperty({
    format: 'uuid',
    description: 'Permission IDs to grant to user.',
  })
  @IsUUID('4', { each: true })
  permissionIds!: string[];
}
