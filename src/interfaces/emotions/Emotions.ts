export interface EmotionData {
  emoji: string
  optionalMessage?: string
}

export interface EmotionResponse {
  userId: string
  emoji: string
  optionalMessage?: string
  createdAt: string
}