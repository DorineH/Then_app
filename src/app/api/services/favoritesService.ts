// service favoris
// import axios from 'axios'
import { ensureToken } from './authService'
import { axiosInstance } from './http'
import { AddApiFavoriteProps } from '@/interfaces/favoris/Favoris'

export type FieldType = 'text' | 'url' | 'number' | 'date'

type AddCategoryPayload = {
  name?: string
  fields: { name: string; label: string; required: boolean; type: FieldType }[]
}

const ServiceFavoris = {
  async getCategories() {
    try {
      await ensureToken() // en dev : auto-login demo si pas de token
      const { data } = await axiosInstance.get('/favorites/categories')
      return data
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Error fetching categories'
      console.error('Error fetching categories:', err)
      throw new Error(msg)
    }
  },

  async addCategory(payload: AddCategoryPayload) {
    try {
      await ensureToken()
      const { data } = await axiosInstance.post('/favorites/categories', payload)
      return data
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Error adding category'
      console.error('Error adding category:', err)
      throw new Error(msg)
    }
  },

  async addFavorite(body: AddApiFavoriteProps) {
    try {
      await ensureToken()
      const { data } = await axiosInstance.post('/favorites/addFavorite', body)
      return data
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Error adding favorite'
      console.error('Error adding favorite:', err)
      throw new Error(msg)
    }
  },

  async getFavorites() {
    try {
      await ensureToken()
      const { data } = await axiosInstance.get('/favorites/getFavorites')
      return data
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Error fetching favorites'
      console.error('Error fetching favorites:', err)
      throw new Error(msg)
    }
  },

  async getFavoritesByCategory(categoryName: string) {
    try {
      await ensureToken()
      const { data } = await axiosInstance.get('/favorites/getFavorites', {
        params: { category: categoryName },
      })
      return data
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err?.message ?? 'Error fetching favorites by category'
      console.error('Error fetching favorites by category:', err)
      throw new Error(msg)
    }
  },
}

export default ServiceFavoris
