import { axiosInstance, getToken, setToken } from './http'
import axios from 'axios'

// Récupérer tous les utilisateurs
export type UserApi = {
  id: string
  coupleId: string
  name: string
  email: string
  age?: number
}

export type DemoLoginPayload = { userId?: string; coupleId?: string; email?: string }
export type DemoLoginResponse = {
  access_token: string
  userId: string
  coupleId: string
  email: string
}

// Inscription d'un utilisateur (création ou rejoindre un couple)
export type RegisterPayload = {
  name: string
  email: string
  age: number
  coupleId?: string // facultatif pour la première inscription
}

export type RegisterResponse = {
  userId: string
  coupleId: string
  email: string
}

// Connexion d'un utilisateur
export type LoginPayload = {
  userId: string
  coupleId: string
  email: string
}

export type LoginResponse = {
  access_token: string
  userId: string
  coupleId: string
  email: string
}

// import { axiosInstance } from './http'

export async function getUsersByCouple(): Promise<UserApi[]> {
  const { data } = await axiosInstance.get('/users/by-couple')
  return data
}

export async function getUsers(): Promise<UserApi[]> {
  const { data } = await axiosInstance.get('/users')
  console.log(data)
  return data
}

export async function loginDemo(): Promise<string> {
  const { data } = await axios.post((process.env.NEXT_PUBLIC_API_BASE ?? '/api') + '/auth/demo', {}) // @Public côté Nest
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

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await axios.post(
    (process.env.NEXT_PUBLIC_API_BASE ?? '/api') + '/users',
    payload
  )
  return data
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await axios.post(
    (process.env.NEXT_PUBLIC_API_BASE ?? '/api') + '/auth/demo',
    payload
  )
  setToken(data?.access_token)
  return data
}
