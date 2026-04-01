import { ApiProperty } from '@nestjs/swagger';

export class SessionInfoDto {
  @ApiProperty({ description: 'Session ID' })
  id!: number;

  @ApiProperty({ description: 'Device name extracted from user agent' })
  deviceName!: string;

  @ApiProperty({ description: 'IP address', required: false })
  ipAddress?: string;

  @ApiProperty({ description: 'Last activity timestamp' })
  lastActivity!: Date;

  @ApiProperty({ description: 'Session creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Whether this is the current session' })
  isCurrent!: boolean;

  @ApiProperty({ description: 'Session expiration timestamp' })
  expiresAt!: Date;

  @ApiProperty({ description: 'User ID associated with the session' })
  userId!: string;
}
