import authService from './authService'

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
      const response = await fetch(`${this.baseURL}/my-data/profile`, {
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
      // Handle base64 image objects
      let actualFile = file
      if (file && typeof file === 'object' && file.imageUrl && file.imageUrl.startsWith('data:')) {
        console.log('UserProfileService: Convirtiendo imagen base64 a archivo')
        actualFile = this._base64ToFile(file.imageUrl, file.filename || 'profile-photo.jpg')
      }
      
      console.log('UserProfileService: Archivo original:', {
        originalFile: file,
        hasImageUrl: file && file.imageUrl ? 'Sí' : 'No',
        imageUrlType: file && file.imageUrl ? typeof file.imageUrl : 'N/A'
      })
      
      console.log('UserProfileService: Archivo procesado:', {
        fileName: actualFile.name,
        fileSize: actualFile.size,
        fileType: actualFile.type,
        fileTypeParam: fileType
      })
      
      const formData = new FormData()
      formData.append('file', actualFile)
      formData.append('file_type', fileType)

      console.log('UserProfileService: FormData creado:', {
        hasFile: formData.has('file'),
        hasFileType: formData.has('file_type'),
        fileTypeValue: formData.get('file_type')
      })

      const response = await fetch(`${this.baseURL}/my-data/upload`, {
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
      console.log('UserProfileService: Upload exitoso:', result)
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
      const { pendingChanges, uploadedFile, userAvatar } = changes
      
      // Upload files first if any
      let fileUploads = []
      
      if (uploadedFile) {
        const cvUpload = await this.uploadFile(uploadedFile, 'cv')
        fileUploads.push(cvUpload)
      }
      
      if (userAvatar) {
        const photoUpload = await this.uploadFile(userAvatar, 'photo')
        fileUploads.push(photoUpload)
      }
      
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
      const response = await fetch(`${this.baseURL}/my-data/profile-picture/${userId}`, {
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
      console.log('UserProfileService: Avatar cargado:', result)
      return result
    } catch (error) {
      console.error('Error getting user avatar:', error)
      throw error
    }
  }
}

// Export singleton instance
const userProfileService = new UserProfileService()
export default userProfileService
