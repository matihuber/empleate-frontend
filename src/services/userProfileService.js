import authService from './authService'
import apiInterceptor from './apiInterceptor'

const API_BASE_URL = 'http://localhost:8000/api/v1'

class UserProfileService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  /**
   * Update user profile information
   */
  async updateProfile(profileData) {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/my-data/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.accessToken}`
        },
        body: JSON.stringify(profileData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  /**
   * Convert base64 image to File object
   */
  _base64ToFile(base64String, filename = 'profile-photo.jpg') {
    try {
      // Extract the base64 data from the data URL
      const base64Data = base64String.split(',')[1]
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'image/jpeg' })
      
      // Generate unique filename with timestamp
      const timestamp = Date.now()
      const uniqueFilename = `${timestamp}_${filename}`
      
      console.log('UserProfileService: Archivo convertido:', {
        originalName: filename,
        uniqueName: uniqueFilename,
        size: byteArray.length,
        type: 'image/jpeg'
      })
      
      return new File([blob], uniqueFilename, { type: 'image/jpeg' })
    } catch (error) {
      console.error('Error converting base64 to file:', error)
      throw new Error('Failed to convert image to file')
    }
  }

  /**
   * Upload a file (CV, profile photo, LinkedIn data)
   */
  async uploadFile(file, fileType) {
    try {
              console.log('UserProfileService: Iniciando upload de archivo tipo:', fileType)

        // Handle base64 image objects (solo para fotos)
        let actualFile = file
        if (fileType === 'photo' && file && typeof file === 'object' && file.imageUrl && file.imageUrl.startsWith('data:')) {
          console.log('UserProfileService: Convirtiendo imagen base64 a archivo')
          actualFile = this._base64ToFile(file.imageUrl, file.filename || 'profile-photo.jpg')
        } else if (file instanceof File) {
          // Para CV y LinkedIn, usar el archivo directamente
          actualFile = file
          console.log('UserProfileService: Archivo File detectado:', actualFile.name)
        } else {
          throw new Error(`Tipo de archivo no válido para ${fileType}: ${typeof file}`)
        }

        console.log('UserProfileService: Archivo procesado correctamente')
      
              console.log('UserProfileService: Archivo procesado correctamente')
      
      const formData = new FormData()
      formData.append('file', actualFile)
      formData.append('file_type', fileType)


      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/my-data/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.accessToken}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('UserProfileService: Error response:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        })
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
              console.log('UserProfileService: Archivo subido exitosamente')
      return result
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  /**
   * Save all pending changes (profile data + files)
   */
  async saveAllChanges(changes) {
    try {
      console.log('UserProfileService: Iniciando guardado de cambios')
      const { pendingChanges, uploadedCVFile, uploadedLinkedInFile, userAvatar } = changes
      
      // Upload files in parallel for better performance
      const uploadPromises = []
      
      // Prepare CV upload promise
      if (uploadedCVFile) {
        console.log('UserProfileService: Preparando subida de CV')
        uploadPromises.push(
          this.uploadWithEnhancedExtraction(uploadedCVFile.file || uploadedCVFile, 'cv')
            .then(result => {
              console.log('UserProfileService: CV subido y extraído exitosamente')
              return result
            })
        )
      }
      
      // Prepare LinkedIn upload promise
      if (uploadedLinkedInFile) {
        console.log('UserProfileService: Preparando subida de LinkedIn:', uploadedLinkedInFile.importType)
        uploadPromises.push(
          this.uploadWithEnhancedExtraction(uploadedLinkedInFile.file || uploadedLinkedInFile, 'linkedin')
            .then(result => {
              console.log('UserProfileService: LinkedIn subido y extraído exitosamente')
              return result
            })
        )
      }
      
      // Prepare avatar upload promise
      if (userAvatar && userAvatar.needsUpload) {
        console.log('UserProfileService: Preparando subida de avatar')
        uploadPromises.push(
          this.uploadFile(userAvatar, 'photo')
            .then(result => {
              console.log('UserProfileService: Avatar subido exitosamente')
              return result
            })
        )
      } else if (userAvatar && !userAvatar.needsUpload) {
        console.log('UserProfileService: Avatar ya existe, no necesita ser subido')
      }
      
      // Execute all uploads in parallel
      console.log('UserProfileService: Ejecutando subidas en paralelo...')
      const fileUploads = await Promise.all(uploadPromises)
      
      // Update profile data if any
      if (Object.keys(pendingChanges).length > 0) {
        const profileUpdate = await this.updateProfile(pendingChanges)
        fileUploads.push(profileUpdate)
      }
      
      return {
        success: true,
        message: 'All changes saved successfully',
        fileUploads,
        profileUpdated: Object.keys(pendingChanges).length > 0
      }
      
    } catch (error) {
      console.error('Error saving all changes:', error)
      throw error
    }
  }

  /**
   * Get user avatar/profile picture
   */
  async getUserAvatar(userId) {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/my-data/profile-picture/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authService.accessToken}`
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          // No profile picture found
          return null
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('UserProfileService: Foto de perfil cargada exitosamente')
      return result
    } catch (error) {
      console.error('Error getting user avatar:', error)
      throw error
    }
  }

  /**
   * Get user CV
   */
  async getUserCV(userId) {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/my-data/cv/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authService.accessToken}`
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          // No CV found - no es un error, devolver null silenciosamente
          return null
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('UserProfileService: CV cargado exitosamente')
      return result
    } catch (error) {
      // Si es 404, devolver null silenciosamente sin lanzar error
      if (error.message.includes('404')) {
        return null
      }
      console.error('Error getting user CV:', error)
      throw error
    }
  }

  /**
   * Get user LinkedIn profile
   */
  async getUserLinkedIn(userId) {
    try {
      const response = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/my-data/linkedin/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authService.accessToken}`
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          // No LinkedIn profile found - no es un error, devolver null silenciosamente
          return null
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('UserProfileService: Perfil de LinkedIn cargado exitosamente')
      return result
    } catch (error) {
      // Si es 404, devolver null silenciosamente sin lanzar error
      if (error.message.includes('404')) {
        return null
      }
      console.error('Error getting user LinkedIn profile:', error)
      throw error
    }
  }

  /**
   * Upload file with enhanced extraction (for CVs and LinkedIn PDFs)
   */
  async uploadWithEnhancedExtraction(file, fileType) {
    try {
      console.log('UserProfileService: Iniciando subida con extracción mejorada')
      
      // First upload the file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_type', fileType)


      const uploadResponse = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/my-data/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.accessToken}`
        },
        body: formData
      })

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed! status: ${uploadResponse.status}`)
      }

      const uploadData = await uploadResponse.json()
      console.log('UserProfileService: Archivo subido exitosamente')

      // Then extract data using enhanced service
      if (fileType === 'cv' || fileType === 'linkedin') {
        const extractResponse = await apiInterceptor.fetchWithInterceptor(`${this.baseURL}/my-data/extract-enhanced`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.accessToken}`
          },
          body: JSON.stringify({
            file_key: uploadData.file_key
          })
        })

        if (!extractResponse.ok) {
          throw new Error(`Enhanced extraction failed! status: ${extractResponse.status}`)
        }

        const extractData = await extractResponse.json()
        console.log('UserProfileService: Extracción mejorada completada exitosamente')
        
        return {
          ...uploadData,
          extraction: extractData
        }
      }

      return uploadData
    } catch (error) {
      console.error('Error in upload with enhanced extraction:', error)
      throw error
    }
  }
}

// Export singleton instance
const userProfileService = new UserProfileService()
export default userProfileService
