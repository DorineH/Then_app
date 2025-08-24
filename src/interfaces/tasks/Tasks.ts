export type Category = 'work' | 'personal' | 'appointment' | 'other'

export interface Task {
  id: string
  userId: string
  coupleId: string
  title: string
  description?: string
  date: string // YYYY-MM-DD
  time?: string // HH:mm
  category: Category
  done: boolean
  createdAt: string
  updatedAt: string
}

export interface TaskResponse {
  tasks: Task[]
}
