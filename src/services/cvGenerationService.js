import authService from './authService'
import apiInterceptor from './apiInterceptor'

const API_BASE_URL = 'http://localhost:8000/api/v1'

class CVGenerationService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async generateCV(generationData) {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/cv/generate`, {
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
      console.log('CVGenerationService: CV generado exitosamente')
      return result
    } catch (error) {
      console.error('Error generating CV:', error)
      throw error
    }
  }

  async getCVVersion(cvVersionId) {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/cv/version/${cvVersionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authService.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('CVGenerationService: Versión de CV obtenida exitosamente')
      return result
    } catch (error) {
      console.error('Error getting CV version:', error)
      throw error
    }
  }

  async saveDraft(cvVersionId, contentPatch, layoutOverrides = null) {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/cv/draft/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.accessToken}`
        },
        body: JSON.stringify({
          cv_version_id: cvVersionId,
          content_patch: contentPatch,
          layout_overrides: layoutOverrides
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('CVGenerationService: Draft guardado exitosamente')
      return result
    } catch (error) {
      console.error('Error saving draft:', error)
      throw error
    }
  }

  async exportCV(cvVersionId, format = 'pdf', useDraft = false) {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/cv/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.accessToken}`
        },
        body: JSON.stringify({
          cv_version_id: cvVersionId,
          use_draft: useDraft,
          format: format
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('CVGenerationService: CV exportado exitosamente')
      return result
    } catch (error) {
      console.error('Error exporting CV:', error)
      throw error
    }
  }

  // Helper method to prepare generation data from frontend state
  prepareGenerationData(templateId, personalizationData, skills) {
    return {
      template_id: templateId,
      language: 'es', // Default to Spanish
      tone: 'modern', // Default to modern tone
      target_role: personalizationData.rol,
      target_company: personalizationData.empresa || null,
      job_posting_url: personalizationData.link || null,
      personalization_level: this.mapPersonalizationLevel(personalizationData.nivel),
      max_tokens: 6000 // Default token limit
    }
  }

  // Helper method to map personalization levels
  mapPersonalizationLevel(frontendLevel) {
    const mapping = {
      'Básico': 'basico',
      'Medio': 'medio',
      'Avanzado': 'avanzado'
    }
    return mapping[frontendLevel] || 'basico'
  }
}

const cvGenerationService = new CVGenerationService()
export default cvGenerationService
