import apiInterceptor from './apiInterceptor'

const API_BASE_URL = 'http://localhost:8000/api/v1'

class NotificationService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(activityId) {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/home/notifications/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          activity_id: String(activityId)
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  /**
   * Delete a notification
   */
  async delete(activityId) {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/home/notifications/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          activity_id: String(activityId)  // Convertir a string
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  }
}

const notificationService = new NotificationService()
export default notificationService
