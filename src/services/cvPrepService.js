import authService from './authService'
import apiInterceptor from './apiInterceptor'

const API_BASE_URL = 'http://localhost:8000/api/v1'

class CVPrepService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async selectTemplate(templateId) {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/cv/select-template`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.accessToken}`
        },
        body: JSON.stringify({ template_id: templateId })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('CVPrepService: Template selected successfully')
      return result
    } catch (error) {
      console.error('Error selecting template:', error)
      throw error
    }
  }

  async savePrefill(prefillData) {
    try {
      // Convert frontend data format to backend format
      const backendData = {
        desired_role: prefillData.rol,
        target_company: prefillData.empresa || null,
        job_posting_url: prefillData.link || null,
        highlights: prefillData.aspectos || null,
        personalization_level: this.mapPersonalizationLevel(prefillData.nivel),
        skills: prefillData.skills.map(skill => ({
          tool: skill.tool,
          level: this.mapSkillLevel(skill.level)
        }))
      }

      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/cv/prefill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.accessToken}`
        },
        body: JSON.stringify(backendData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('CVPrepService: Prefill data saved successfully')
      return result
    } catch (error) {
      console.error('Error saving prefill data:', error)
      throw error
    }
  }

  async getPrefill() {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/cv/prefill`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authService.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('CVPrepService: Prefill data loaded successfully')
      return result
    } catch (error) {
      console.error('Error getting prefill data:', error)
      throw error
    }
  }

  async getSuggestions() {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/cv/prefill/suggestions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authService.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('CVPrepService: Suggestions loaded successfully')
      return result
    } catch (error) {
      console.error('Error getting suggestions:', error)
      throw error
    }
  }

  async checkReadyStatus() {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/cv/ready`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authService.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('CVPrepService: Ready status checked successfully')
      return result
    } catch (error) {
      console.error('Error checking ready status:', error)
      throw error
    }
  }

  // Helper methods to map between frontend and backend formats
  mapPersonalizationLevel(frontendLevel) {
    const mapping = {
      'Básico': 'basico',
      'Medio': 'medio',
      'Avanzado': 'avanzado'
    }
    return mapping[frontendLevel] || 'basico'
  }

  mapSkillLevel(frontendLevel) {
    const mapping = {
      'Básico': 'basico',
      'Intermedio': 'intermedio',
      'Avanzado': 'avanzado',
      'Experto': 'experto'
    }
    return mapping[frontendLevel] || 'basico'
  }

  // Convert backend data to frontend format
  convertBackendToFrontend(backendData) {
    return {
      rol: backendData.desired_role || '',
      empresa: backendData.target_company || '',
      link: backendData.job_posting_url || '',
      aspectos: backendData.highlights || '',
      nivel: this.mapBackendPersonalizationLevel(backendData.personalization_level),
      skills: backendData.skills.map(skill => ({
        tool: skill.tool,
        level: this.mapBackendSkillLevel(skill.level)
      }))
    }
  }

  mapBackendPersonalizationLevel(backendLevel) {
    const mapping = {
      'basico': 'Básico',
      'medio': 'Medio',
      'avanzado': 'Avanzado'
    }
    return mapping[backendLevel] || 'Básico'
  }

  mapBackendSkillLevel(backendLevel) {
    const mapping = {
      'basico': 'Básico',
      'intermedio': 'Intermedio',
      'avanzado': 'Avanzado',
      'experto': 'Experto'
    }
    return mapping[backendLevel] || 'Básico'
  }
}

const cvPrepService = new CVPrepService()
export default cvPrepService
