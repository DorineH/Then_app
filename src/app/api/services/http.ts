import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE ?? '/api',
  withCredentials: false,
  headers: { Accept: 'application/json' },
})

const TOKEN_KEY = 'then_token'

export const getToken = (): string | null =>
  typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

axiosInstance.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(undefined, async (error) => {
  if (error?.response?.status === 401) {
    localStorage.removeItem(TOKEN_KEY)
  }
  throw error
})
