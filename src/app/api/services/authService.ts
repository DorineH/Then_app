import { axiosInstance, getToken, setToken } from './http'

export type DemoLoginPayload = { userId?: string; coupleId?: string; email?: string }
export type DemoLoginResponse = {
  access_token: string
  userId: string
  coupleId: string
  email: string
}

export async function loginDemo(): Promise<string> {
  const { data } = await axiosInstance.post('/auth/demo', {}) // @Public côté Nest
  const token = data?.access_token
  if (!token) throw new Error('No token received')
  setToken(token)
  return token
}

export async function ensureToken(): Promise<string> {
  const existing = getToken()
  if (existing) return existing
  if (process.env.NODE_ENV === 'production') {
    throw new Error('No token found in production')
  }
  return await loginDemo()
}

export type Claims = { userId: string; coupleId: string; email: string; iat?: number; exp?: number }
export function decodeClaims(): Claims | null {
  try {
    const t = getToken()
    if (!t) return null
    const payload = JSON.parse(atob(t.split('.')[1]))
    return payload
  } catch {
    return null
  }
}
