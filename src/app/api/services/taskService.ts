import { Task, TaskResponse } from '@/interfaces/tasks/Tasks'
import { axiosInstance } from './http'
import toast from 'react-hot-toast'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const msg = (e: any) => e?.response?.data?.message || e?.message || 'Une erreur est survenue'

export type CreateTaskInput = Pick<
  Task,
  'title' | 'description' | 'date' | 'time' | 'category' | 'done'
>
export type UpdateTaskInput = Partial<CreateTaskInput>

const ServiceTasks = {
  async getTasksByMonth(year: number, month: number) {
    try {
      const response = await axiosInstance.get<Task[]>(`/tasks/month`, {
        params: { year, month },
      })
      return response.data || []
    } catch (error) {
      console.error('Error getting tasks by month:', error)
      throw error
    }
  },
  async getTasks(date: string): Promise<Task[]> {
    try {
      const response = await axiosInstance.get<Task[]>(`/tasks`, { params: { date } })
      return Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error('Error get tasks:', error)
      throw error
    }
  },

  async getTaskRange(from?: string, to?: string) {
    try {
      const response = await axiosInstance.get<TaskResponse[]>(`/tasks/range`, {
        params: { from, to },
      })
      return response.data || []
    } catch (error) {
      console.error('Error getting task range:', error)
      throw error
    }
  },

  async addTask(payload: CreateTaskInput): Promise<TaskResponse> {
    try {
      return await toast.promise(
        axiosInstance.post<TaskResponse>('/tasks', payload).then((r) => r.data),
        {
          loading: 'Ajout de la tâche…',
          success: 'Tâche ajoutée ✅',
          error: (e) => msg(e),
        }
      )
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    try {
      await toast.promise(axiosInstance.delete(`/tasks/${taskId}`), {
        loading: 'Suppression…',
        success: 'Tâche supprimée 🗑️',
        error: (e) => msg(e),
      })
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  },

  async updateTask(taskId: string, dto: UpdateTaskInput): Promise<TaskResponse> {
    try {
      return await toast.promise(
        axiosInstance.put<TaskResponse>(`/tasks/${taskId}`, dto).then((r) => r.data),
        {
          loading: 'Mise à jour…',
          success: 'Tâche mise à jour ✅',
          error: (e) => msg(e),
        }
      )
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  },
}
export default ServiceTasks
