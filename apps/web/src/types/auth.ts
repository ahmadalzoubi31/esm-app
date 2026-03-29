export interface AuthUser {
  id: string
  username: string
  name: string
  email: string
  avatar: string
  roles: { id: number; key: string; name: string }[]
  groups: any[] // We can type this properly if we know the structure
}

export interface SignInDto {
  username?: string
  password?: string
  remember?: boolean
}

export interface ResetPasswordDto {
  userId: string
  password?: string
}

export interface AuthResponse {
  message: string
}
