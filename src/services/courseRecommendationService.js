/**
 * Servicio para manejar las recomendaciones de cursos
 */

import apiInterceptor from './apiInterceptor'
import { API_URL } from '../config/api'

class CourseRecommendationService {
  constructor() {
    this.baseURL = `${API_URL}/course-recommendations`
  }

  /**
   * Genera recomendaciones de cursos personalizadas
   */
  async generateRecommendations() {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        // Manejar error 403 específicamente (puede devolver HTML en lugar de JSON)
        if (response.status === 403) {
          const permissionError = new Error('Acceso denegado. Esta funcionalidad requiere un plan Premium.')
          permissionError.code = 'SUBSCRIPTION_REQUIRED'
          permissionError.status = 403
          throw permissionError
        }

        // Para otros errores, intentar parsear JSON si el content-type es apropiado
        const contentType = response.headers.get('content-type')
        let errorData = {}

        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json().catch(() => ({}))
        }

        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error generando recomendaciones de cursos:', error)
      throw error
    }
  }

  /**
   * Obtiene las recomendaciones del usuario
   */
  async getMyRecommendations() {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/my-recommendations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error obteniendo recomendaciones:', error)
      throw error
    }
  }

  /**
   * Obtiene el análisis de habilidades del usuario
   */
  async getSkillAnalysis() {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/skill-analysis`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null // No hay análisis disponible
        }
        const errorData = await response.json()
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error obteniendo análisis de habilidades:', error)
      throw error
    }
  }


  /**
   * Verifica el estado del servicio
   */
  async checkHealth() {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error verificando estado del servicio:', error)
      throw error
    }
  }

  /**
   * Formatea el precio para mostrar
   */
  formatPrice(priceUsd, priceArs, isFree, currency = 'USD') {
    if (isFree || priceUsd === 0 || priceUsd === null) {
      return 'Gratuito'
    }

    if (currency === 'USD' && priceUsd) {
      return `${priceUsd.toFixed(2)} USD`
    }

    if (priceArs) {
      return `${priceArs.toLocaleString('es-AR')} ARS`
    }

    return 'Precio no disponible'
  }

  /**
   * Obtiene el color de la plataforma
   */
  getPlatformColor(platform) {
    const colors = {
      'coursera': 'bg-blue-100 text-blue-800',
      'udemy': 'bg-purple-100 text-purple-800',
      'aws skillbuilder': 'bg-orange-100 text-orange-800',
      'aws academy': 'bg-orange-100 text-orange-800',
      'edx': 'bg-green-100 text-green-800',
      'pluralsight': 'bg-red-100 text-red-800',
      'linkedin learning': 'bg-blue-100 text-blue-800',
      'other': 'bg-gray-100 text-gray-800'
    }
    return colors[platform] || colors['other']
  }

  /**
   * Obtiene el icono de la plataforma
   */
  getPlatformIcon(platform) {
    // Por ahora retornamos un icono genérico
    // Se puede expandir para tener iconos específicos
    return '📚'
  }

  /**
   * Formatea el nivel de habilidad
   */
  formatSkillLevel(skillLevel) {
    const levels = {
      'beginner': 'Principiante',
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado',
      'expert': 'Experto'
    }
    return levels[skillLevel] || skillLevel
  }

  /**
   * Formatea la duración del curso
   */
  formatDuration(durationHours) {
    if (!durationHours) return 'Duración no especificada'
    
    if (durationHours < 1) {
      return `${Math.round(durationHours * 60)} minutos`
    } else {
      return `${Math.round(durationHours)} horas`
    }
  }

}

const courseRecommendationService = new CourseRecommendationService()
export default courseRecommendationService
