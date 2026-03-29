export interface SessionInfo {
  id: number
  deviceName: string
  ipAddress?: string
  lastActivity: Date
  createdAt: Date
  expiresAt: Date
  isCurrent: boolean
  userId: string
}
