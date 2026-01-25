import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity({ tableName: 'refresh_token' })
export class RefreshToken {
  @PrimaryKey()
  id!: number;

  @Property()
  user_id!: string;

  @Property()
  token!: string;

  @Property()
  expires_at!: Date;

  @Property()
  is_revoked!: boolean;

  @Property({ onCreate: () => new Date() })
  created_at?: Date;

  @Property({ nullable: true })
  revoked_at?: Date;

  // Session metadata
  @Property({ nullable: true, length: 45 })
  ip_address!: string;

  @Property({ type: 'text', nullable: true })
  user_agent!: string;

  @Property({ nullable: true })
  device_name!: string;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  last_activity?: Date;
}
