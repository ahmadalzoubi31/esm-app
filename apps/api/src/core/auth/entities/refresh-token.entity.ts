import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity({ tableName: 'refresh_tokens' })
export class RefreshToken {
  @PrimaryKey()
  id!: number;

  @Property()
  userId!: string;

  @Property()
  token!: string;

  @Property()
  expiresAt!: Date;

  @Property()
  isRevoked!: boolean;

  @Property({ onCreate: () => new Date() })
  createdAt?: Date;

  @Property({ nullable: true })
  revokedAt?: Date;

  // Session metadata
  @Property({ nullable: true, length: 45 })
  ipAddress!: string;

  @Property({ type: 'text', nullable: true })
  userAgent!: string;

  @Property({ nullable: true })
  deviceName!: string;

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  lastActivity?: Date;
}
