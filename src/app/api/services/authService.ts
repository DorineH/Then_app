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
// export async function bootstrapToken(): Promise<string> {
//   let token = getToken()
//   if (!token) {
//     const { data } = await axiosInstance.post('/auth/demo', {}) // public
//     token = data?.access_token
//     if (!token) throw new Error('No token received')
//     setToken(token)
//   } else {
//     // s’assure que l’instance axios a bien l’en-tête
//     setToken(token)
//   }
//   return token
// }
