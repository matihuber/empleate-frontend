import authService from './authService'
import apiInterceptor from './apiInterceptor'
import { API_URL } from '../config/api'

class TemplateService {
  constructor() {
    this.baseURL = API_URL
  }

  /**
   * Get all available CV templates
   */
  async getTemplates(category = null) {
    try {
      let url = `${this.baseURL}/template-engine/templates`
      if (category) {
        url += `?category=${category}`
      }

      const response = await apiInterceptor.fetchWithInterceptor(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authService.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const templates = await response.json()
      return templates
    } catch (error) {
      console.error('Error getting templates:', error)
      throw error
    }
  }

  /**
   * Get template by ID
   */
  async getTemplate(templateId) {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/template-engine/templates/${templateId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authService.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const template = await response.json()
      console.log('TemplateService: Template obtenido exitosamente')
      return template
    } catch (error) {
      console.error('Error getting template:', error)
      throw error
    }
  }

  /**
   * Get template layout specification
   */
  async getTemplateLayout(templateId) {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/template-engine/templates/${templateId}/layout`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authService.accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const layout = await response.json()
      console.log('TemplateService: Layout del template obtenido exitosamente')
      return layout
    } catch (error) {
      console.error('Error getting template layout:', error)
      throw error
    }
  }

  /**
   * Check if a template is basic (available for FREE users) or advanced (PRO+ only)
   */
  isBasicTemplate(template) {
    // Usar el campo 'tier' del backend si está disponible
    if (template.tier) {
      return template.tier === 'basic';
    }
    
    // Fallback: usar IDs conocidos para compatibilidad
    const basicTemplateIds = ['clasico'];
    return basicTemplateIds.includes(template.id) || basicTemplateIds.includes(template.name?.toLowerCase());
  }

  /**
   * Filter templates based on user subscription tier
   */
  filterTemplatesByTier(templates, userTier) {
    if (userTier === 'free') {
      return templates.filter(template => this.isBasicTemplate(template));
    }
    
    // PRO y PREMIUM pueden acceder a todos los templates
    return templates;
  }
}

// Export singleton instance
const templateService = new TemplateService()
export default templateService
