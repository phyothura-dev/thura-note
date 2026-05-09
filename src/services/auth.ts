import type { ApiSuccess } from '@/types/api'
import type { LoginPayload, LoginResponse, RegisterPayload, User } from '@/types/auth'
import { http } from './http'

export async function loginApi(payload: LoginPayload) {
  const { data } = await http.post<ApiSuccess<LoginResponse>>('/auth/login', payload)
  return data.data
}

export async function registerApi(payload: RegisterPayload) {
  const { data } = await http.post<ApiSuccess<User>>('/auth/register', payload)
  return data.data
}
