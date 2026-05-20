import { api } from './axios'
import type {
  LoginRequest,
  RegisterRequest,
  EmailVerifyRequest,
  EmailVerifyConfirmRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  User
} from '../types/auth'
import type { AxiosResponse } from 'axios'

export const login = (data: LoginRequest): Promise<AxiosResponse> => api.post('/auth/login', data)

export const register = (data: RegisterRequest): Promise<AxiosResponse> =>
  api.post('/auth/register', data)

export const refreshToken = (): Promise<AxiosResponse> => api.post('/auth/token/refresh')

export const logout = (): Promise<AxiosResponse> => api.post('/auth/token/logout')

export const getMe = (): Promise<AxiosResponse<User>> => api.get('/auth/me')

export const checkNickname = (nickname: string): Promise<AxiosResponse<boolean>> =>
  api.get('/auth/check-nickname', { params: { nickname } })

export const requestEmailVerify = (data: EmailVerifyRequest): Promise<AxiosResponse> =>
  api.post('/auth/email/verify/request', data)

export const confirmEmailVerify = (data: EmailVerifyConfirmRequest): Promise<AxiosResponse> =>
  api.post('/auth/email/verify/confirm', data)

export const requestPasswordReset = (data: PasswordResetRequest): Promise<AxiosResponse> =>
  api.post('/auth/reset-password/request', data)

export const confirmPasswordReset = (data: PasswordResetConfirmRequest): Promise<AxiosResponse> =>
  api.post('/auth/reset-password/confirm', data)
