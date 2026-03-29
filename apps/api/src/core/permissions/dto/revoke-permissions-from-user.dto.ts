import { IsObject, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { RevokePermissionsFromUserDto as IRevokePermissionFromUserDto } from '@repo/shared';

export class RevokePermissionsFromUserDto implements IRevokePermissionFromUserDto {

  @ApiProperty({
    format: 'uuid',
    description: 'Permission IDs to grant to user.',
  })
  @IsUUID('4', { each: true })
  permissionIds!: string[];

  @ApiProperty({
    description: 'Metadata to assign to user.',
  })
  @IsObject()
  metadata!: Record<string, any>;
}
