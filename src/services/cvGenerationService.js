import authService from './authService'
import apiInterceptor from './apiInterceptor'

const API_BASE_URL = 'http://localhost:8000/api/v1'

class CVGenerationService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  /**
   * Generate CV using OpenAI and selected template
   */
  async generateCV(generationData) {
    try {
      const url = `${this.baseURL}/cv/generate`
      console.log('🔍 CVGenerationService: Generando CV...')
      console.log('🔍 CVGenerationService: Datos:', generationData)

      const response = await apiInterceptor.fetchWithInterceptor(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.accessToken}`
        },
        body: JSON.stringify(generationData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ CVGenerationService: CV generado exitosamente')
      return result
    } catch (error) {
      console.error('❌ CVGenerationService: Error generando CV:', error)
      throw error
    }
  }

  /**
   * Save CV draft
   */
  async saveCVDraft(draftData) {
    try {
      const url = `${this.baseURL}/cv/draft`
      console.log('🔍 CVGenerationService: Guardando borrador...')

      const response = await apiInterceptor.fetchWithInterceptor(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.accessToken}`
        },
        body: JSON.stringify(draftData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ CVGenerationService: Borrador guardado exitosamente')
      return result
    } catch (error) {
      console.error('❌ CVGenerationService: Error guardando borrador:', error)
      throw error
    }
  }

  /**
   * Get CV draft by ID
   */
  async getCVDraft(draftId) {
    try {
      const url = `${this.baseURL}/cv/draft/${draftId}`
      console.log('🔍 CVGenerationService: Obteniendo borrador...')

      const response = await apiInterceptor.fetchWithInterceptor(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authService.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ CVGenerationService: Borrador obtenido exitosamente')
      return result
    } catch (error) {
      console.error('❌ CVGenerationService: Error obteniendo borrador:', error)
      throw error
    }
  }

  /**
   * Export CV to PDF
   */
  async exportCVToPDF(exportData) {
    try {
      const url = `${this.baseURL}/cv/export`
      console.log('🔍 CVGenerationService: Exportando CV a PDF...')

      const response = await apiInterceptor.fetchWithInterceptor(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.accessToken}`
        },
        body: JSON.stringify(exportData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ CVGenerationService: CV exportado exitosamente')
      return result
    } catch (error) {
      console.error('❌ CVGenerationService: Error exportando CV:', error)
      throw error
    }
  }
}

// Export singleton instance
const cvGenerationService = new CVGenerationService()
export default cvGenerationService
