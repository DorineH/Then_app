// services/emotionService.ts
import { EmotionData, EmotionResponse } from '@/interfaces/emotions/Emotions'
import { axiosInstance } from './http'

const ServiceEmotions = {
  async addEmotion(data: EmotionData) {
    try {
      const response = await axiosInstance.post<EmotionResponse>('/emotion/addEmotion', data)
      return response.data
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  async getCurrentEmotions(): Promise<EmotionResponse[]> {
    try {
      const response = await axiosInstance.get<EmotionResponse[]>('/emotion/getEmotions')

      console.log('Emotions fetched:', response.data)

      return response.data || []
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  async getLastEmotionPerUser(): Promise<{ [userId: string]: EmotionResponse }> {
    try {
      const response = await axiosInstance.get('/emotion/lastEmotionByUser')

      console.log(response.data)

      return response.data || {}
    } catch (error) {
      console.error('Error fetching last emotion per user:', error)
      throw error
    }
  },

  //   async deleteEmotion(): Promise<void> {
  //     try {
  //       await axiosInstance.delete('/emotion')
  //     } catch (error) {
  //       console.error('Error deleting emotion:', error)
  //       throw error
  //     }
  //   },
}

export default ServiceEmotions
