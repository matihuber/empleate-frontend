import apiInterceptor from './apiInterceptor'
import { API_URL } from '../config/api'

class ConfigService {
  constructor() {
    this.baseURL = API_URL
  }

  /**
   * Get user preferences (profile type, province, and subscription)
   */
  async getPreferences() {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/config/preferences`, {
        method: 'GET'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Error al obtener preferencias')
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting preferences:', error)
      throw error
    }
  }

  /**
   * Update user preferences (profile type and province)
   */
  async updatePreferences(profileType, province) {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/config/preferences`, {
        method: 'PATCH',
        body: JSON.stringify({
          profile_type: profileType,
          province: province
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Error al actualizar preferencias')
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating preferences:', error)
      throw error
    }
  }

  /**
   * Create a support ticket
   */
  async createSupportTicket(subject, description) {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/config/support/ticket`, {
        method: 'POST',
        body: JSON.stringify({
          subject: subject,
          description: description
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Error al crear ticket de soporte')
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating support ticket:', error)
      throw error
    }
  }

  /**
   * Delete user account completely
   */
  async deleteAccount() {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/config/account`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Error al eliminar cuenta')
      }

      return await response.json()
    } catch (error) {
      console.error('Error deleting account:', error)
      throw error
    }
  }
}

// Export singleton instance
const configService = new ConfigService()
export default configService
