import { ApiProperty } from '@nestjs/swagger';

export class SessionInfoDto {
  @ApiProperty({ description: 'Session ID' })
  id: number;

  @ApiProperty({ description: 'Device name extracted from user agent' })
  device_name: string;

  @ApiProperty({ description: 'IP address', required: false })
  ip_address?: string;

  @ApiProperty({ description: 'Last activity timestamp' })
  last_activity: Date;

  @ApiProperty({ description: 'Session creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Whether this is the current session' })
  is_current: boolean;

  @ApiProperty({ description: 'Session expiration timestamp' })
  expires_at: Date;

  @ApiProperty({ description: 'User ID associated with the session' })
  user_id: string;
}
