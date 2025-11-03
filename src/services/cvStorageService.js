import authService from './authService'
import { API_URL } from '../config/api'

class CVStorageService {
  constructor() {
    this.baseURL = API_URL
  }

  /**
   * Guardar CV en el backend
   */
  async saveCV(cvData, cvName, templateId) {
    try {
      const url = `${this.baseURL}/cv/save`
      const token = authService.accessToken
      
      // Saving CV
      
      const requestBody = {
        name: cvName,
        template_id: templateId,
        content_json: cvData,
        is_draft: false
      }
      // Request prepared
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      })

      // Response received
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ CVStorageService: Error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log('✅ CVStorageService: CV guardado exitosamente:', result)
      return result
      
    } catch (error) {
      console.error('❌ CVStorageService: Error guardando CV:', error)
      throw error
    }
  }

  /**
   * Obtener lista de CVs guardados
   */
  async getSavedCVs() {
    try {
      const url = `${this.baseURL}/cv/list`
      const token = authService.accessToken
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ CVStorageService: CVs obtenidos:', result)
      return result
      
    } catch (error) {
      console.error('❌ CVStorageService: Error obteniendo CVs:', error)
      throw error
    }
  }

  /**
   * Eliminar CV guardado
   */
  async deleteCV(cvId) {
    try {
      const url = `${this.baseURL}/cv/${cvId}`
      const token = authService.accessToken
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log('✅ CVStorageService: CV eliminado exitosamente')
      return true
      
    } catch (error) {
      console.error('❌ CVStorageService: Error eliminando CV:', error)
      throw error
    }
  }
}

export const cvStorageService = new CVStorageService()
