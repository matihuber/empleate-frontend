import authService from './authService'
import apiInterceptor from './apiInterceptor'

const API_BASE_URL = 'http://localhost:8000/api/v1'

class TemplateService {
  constructor() {
    this.baseURL = API_BASE_URL
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
      console.log('TemplateService: Templates obtenidos exitosamente')
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
    // Templates básicos disponibles para usuarios FREE
    const basicTemplateIds = ['moderno', 'clasico', 'basico'];
    
    // Si el template tiene un campo 'tier' o 'subscription_required', usarlo
    if (template.tier) {
      return template.tier === 'basic' || template.tier === 'free';
    }
    
    if (template.subscription_required) {
      return !template.subscription_required;
    }
    
    // Fallback: usar IDs conocidos
    return basicTemplateIds.includes(template.id);
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
