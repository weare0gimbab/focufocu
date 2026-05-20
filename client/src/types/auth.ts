export interface User {
  id: number
  email: string
  nickname: string
  profileImageUrl: string | null
  memberRole: 'USER' | 'ADMIN'
  provider: 'LOCAL' | 'KAKAO'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  nickname: string
  emailVerificationCode: string
}

export interface EmailVerifyRequest {
  email: string
}

export interface EmailVerifyConfirmRequest {
  email: string
  code: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmRequest {
  token: string
  newPassword: string
}
