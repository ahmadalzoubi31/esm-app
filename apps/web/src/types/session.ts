export interface SessionInfo {
  id: number
  device_name: string
  ip_address?: string
  last_activity: Date
  created_at: Date
  expires_at: Date
  is_current: boolean
  user_id: string
}
