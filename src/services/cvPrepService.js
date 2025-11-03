import authService from './authService'
import apiInterceptor from './apiInterceptor'
import { API_URL } from '../config/api'

class CVPrepService {
  constructor() {
    this.baseURL = API_URL
  }

  /**
   * Select CV template
   */
  async selectTemplate(templateId) {
    try {
      const url = `${this.baseURL}/cv/select-template`
      console.log('🔍 CVPrepService: Seleccionando template...')
      console.log('🔍 CVPrepService: Template ID:', templateId)

      const response = await apiInterceptor.fetchWithInterceptor(url, {
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
      console.log('✅ CVPrepService: Template seleccionado exitosamente')
      return result
    } catch (error) {
      console.error('❌ CVPrepService: Error seleccionando template:', error)
      throw error
    }
  }

  /**
   * Save CV prefill data
   */
  async savePrefill(prefillData) {
    try {
      const url = `${this.baseURL}/cv/prefill`
      console.log('🔍 CVPrepService: Guardando datos de prefill...')
      console.log('🔍 CVPrepService: Datos:', prefillData)
      console.log('🔍 CVPrepService: Link original:', prefillData.link)

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
      
      console.log('🔍 CVPrepService: Datos convertidos para backend:', backendData)
      console.log('🔍 CVPrepService: job_posting_url final:', backendData.job_posting_url)
      

      const response = await apiInterceptor.fetchWithInterceptor(url, {
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
      console.log('✅ CVPrepService: Datos de prefill guardados exitosamente')
      return result
    } catch (error) {
      console.error('❌ CVPrepService: Error guardando prefill:', error)
      throw error
    }
  }

  /**
   * Get current prefill data
   */
  async getPrefill() {
    try {
      const url = `${this.baseURL}/cv/prefill`
      console.log('🔍 CVPrepService: Obteniendo datos de prefill...')

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
      console.log('✅ CVPrepService: Datos de prefill obtenidos exitosamente')
      return result
    } catch (error) {
      console.error('❌ CVPrepService: Error obteniendo prefill:', error)
      throw error
    }
  }

  /**
   * Check if user is ready to generate CV
   */
  async checkReadyStatus() {
    try {
      const url = `${this.baseURL}/cv/ready-status`
      console.log('🔍 CVPrepService: Verificando estado de preparación...')

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
      console.log('✅ CVPrepService: Estado de preparación verificado')
      return result
    } catch (error) {
      console.error('❌ CVPrepService: Error verificando estado:', error)
      throw error
    }
  }

  /**
   * Map personalization level from frontend to backend
   */
  mapPersonalizationLevel(level) {
    const mapping = {
      'Básico': 'basico',
      'Medio': 'medio',
      'Avanzado': 'avanzado'
    }
    return mapping[level] || 'medio'
  }

  /**
   * Map skill level from frontend to backend
   */
  mapSkillLevel(level) {
    const mapping = {
      'Básico': 'basico',
      'Intermedio': 'intermedio',
      'Avanzado': 'avanzado',
      'Experto': 'experto'
    }
    return mapping[level] || 'intermedio'
  }
}

// Export singleton instance
const cvPrepService = new CVPrepService()
export default cvPrepService
