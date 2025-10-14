import { useState, useEffect } from "react"
import { User, Upload, Camera, Linkedin, X, Check, Trash2 } from "lucide-react"
import UserHomeInput from "../../../components/UserHomeInput"
import LoginButton from "../../../components/LoginButton"
import ImageModal from "../../../components/ImageModal"
import LinkedInImportModal from "../../../components/LinkedInImportModal"
import userProfileService from "../../../services/userProfileService"
import imageCacheService from "../../../services/imageCacheService"
import apiInterceptor from "../../../services/apiInterceptor"
import { useSubscriptionRestrictions } from "../../../hooks/useSubscriptionRestrictions"
import SubscriptionRestrictionModal from "../../../components/SubscriptionRestrictionModal"
import { useSubscription } from "../../../contexts/SubscriptionContext"


export default function MisDatosSection({ user }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [modalStep, setModalStep] = useState('confirm')
  const [userAvatar, setUserAvatar] = useState(null)
  const [currentCV, setCurrentCV] = useState(null)  // CV actual del usuario
  const [currentLinkedIn, setCurrentLinkedIn] = useState(null)  // Perfil de LinkedIn actual del usuario
  const [uploadedCVFile, setUploadedCVFile] = useState(null)
  const [uploadedLinkedInFile, setUploadedLinkedInFile] = useState(null)
  const [showLinkedInModal, setShowLinkedInModal] = useState(false)

  // Hook para restricciones de suscripción
  const {
    executeWithSubscriptionCheck,
    isRestrictionModalOpen,
    restrictedFeature,
    closeRestrictionModal
  } = useSubscriptionRestrictions()

  // Hook para información de suscripción
  const { subscriptionInfo } = useSubscription()
  
  // Estados para cambios pendientes
  const [pendingChanges, setPendingChanges] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')



  // Cargar imagen del usuario cuando se monta el componente
  useEffect(() => {

    // Load user data
    
    const loadUserAvatar = async () => {
      try {
        // Try to get from cache first
        const cachedAvatar = imageCacheService.getImage(user.sub, 'profile')
        if (cachedAvatar && cachedAvatar.imageUrl) {
          setUserAvatar({
            ...cachedAvatar,
            needsUpload: false
          })
          return
        }

        // Load from backend
        const avatarData = await userProfileService.getUserAvatar(user.sub)
        if (avatarData && avatarData.imageUrl) {
          imageCacheService.setImage(user.sub, 'profile', avatarData)
          setUserAvatar({
            ...avatarData,
            needsUpload: false
          })
        } else {
          setUserAvatar(null)
        }
      } catch (error) {
        setUserAvatar(null)
      }
    }

    if (user && user.sub) {
      loadUserAvatar()
    }
  }, [user?.sub]) // Solo ejecutar cuando cambie user.sub, no todo el objeto user

  // Este useEffect se eliminó para evitar re-renders infinitos
  // La lógica de carga de avatar ya está manejada en el useEffect principal

  // Cargar CV actual cuando se monta el componente
  useEffect(() => {
    const loadCurrentCV = async () => {
      try {
        const cvData = await userProfileService.getUserCV(user.sub)
        if (cvData) {
          setCurrentCV(cvData)
        }
      } catch (error) {
        // CV not found - this is normal
      }
    }

    if (user && user.sub) {
      loadCurrentCV()
      
      // Cargar perfil de LinkedIn actual
      const loadCurrentLinkedIn = async () => {
        try {
          const linkedinData = await userProfileService.getUserLinkedIn(user.sub)
          if (linkedinData) {
            setCurrentLinkedIn(linkedinData)
          }
        } catch (error) {
          // LinkedIn profile not found - this is normal
        }
      }
      
      loadCurrentLinkedIn()
    }
  }, [user?.sub]) // Solo ejecutar cuando cambie user.sub, no todo el objeto user

  const handleFieldChange = (field, newValue) => {
    setPendingChanges(prev => ({
      ...prev,
      [field]: newValue
    }))
  }

  const handlePasswordChange = () => {
    setModalStep('confirm')
    setShowPasswordModal(true)
  }

  const handlePasswordChangeConfirm = () => {
    // Send password change email
    // Aquí iría la lógica para enviar el email
    setModalStep('success')
  }

  const handleCloseModal = () => {
    setShowPasswordModal(false)
    setModalStep('confirm')
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // File loaded - solo para CV
      setUploadedCVFile({
        file: file,
        type: 'cv'
      })
      // Aquí iría la lógica para procesar el archivo
    }
  }

  const handleFileDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      // File dropped - solo para CV
      setUploadedCVFile({
        file: file,
        type: 'cv'
      })
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  const getFileIcon = (file) => {
    // Validar que el archivo existe y tiene las propiedades necesarias
    if (!file || !file.name || !file.type) {
      return null
    }
    
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      return (
        <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      )
    }
    return null
  }

  // Nueva función para manejar el cambio de avatar
  const handleAvatarChange = () => {
    setShowAvatarModal(true)
  }

  // Nueva función para guardar el avatar editado
  const handleAvatarSave = (avatarData) => {
    // Saving avatar
    // Marcar que SÍ necesita ser subido (es una nueva imagen)
    setUserAvatar({
      ...avatarData,
      needsUpload: true
    })
    // Aquí iría la lógica para subir la imagen al servidor
    // También podrías usar avatarData.useForCV y avatarData.cropSettings
  }

  const handleLinkedInImport = () => {
    // Verificar acceso usando información local de suscripción
    const canImportLinkedIn = subscriptionInfo?.limits?.can_import_linkedin || false;
    
    if (!canImportLinkedIn) {
      // Mostrar modal de restricción
      setRestrictedFeature('import_linkedin');
      setIsRestrictionModalOpen(true);
      return;
    }

    // Permitir importación de LinkedIn
    setShowLinkedInModal(true);
  }

  const handleLinkedInSave = (data) => {
    // LinkedIn file loaded
    
    // Marcar que hay un archivo de LinkedIn pendiente de subir
    setUploadedLinkedInFile({
      file: data.file,
      type: 'linkedin',
      importType: data.importType
    })
    
    // Marcar que hay cambios pendientes
    setPendingChanges(prev => ({
      ...prev,
      linkedinProfile: true
    }))
    
    // Ocultar el perfil de LinkedIn actual ya que se va a reemplazar
    setCurrentLinkedIn(null)
  }

  // Función para guardar todos los cambios pendientes
  const handleSaveChanges = async () => {
            // Saving changes
    
    if (Object.keys(pendingChanges).length === 0 && 
        !(uploadedCVFile && (uploadedCVFile.file || uploadedCVFile instanceof File)) && 
        !(uploadedLinkedInFile && (uploadedLinkedInFile.file || uploadedLinkedInFile instanceof File)) && 
        !userAvatar) {
      setSaveMessage('No hay cambios para guardar')
      return
    }

    setIsSaving(true)
    setSaveMessage('')

    try {
      // Llamar al servicio para guardar todos los cambios
      const result = await userProfileService.saveAllChanges({
        pendingChanges,
        uploadedCVFile: uploadedCVFile && (uploadedCVFile.file || uploadedCVFile instanceof File) ? uploadedCVFile : null,
        uploadedLinkedInFile: uploadedLinkedInFile && (uploadedLinkedInFile.file || uploadedLinkedInFile instanceof File) ? uploadedLinkedInFile : null,
        userAvatar
      })

      // Save result received

      // Limpiar cambios pendientes
      setPendingChanges({})
      // Si se subió un archivo CV, mostrar mensaje de éxito y actualizar estado
      if (uploadedCVFile && result.fileUploads) {
        const cvUpload = result.fileUploads.find(upload => upload.file_type === 'cv')
        if (cvUpload) {
          // CV upload data received
          setCurrentCV({
            file_key: cvUpload.file_key,
            filename: cvUpload.filename || (uploadedCVFile.file ? uploadedCVFile.file.name : 'cv-uploaded'),
            mime: cvUpload.mime,
            size: cvUpload.size || (uploadedCVFile.file ? uploadedCVFile.file.size : null),
            fileType: 'cv',
            uploadedAt: new Date().toISOString(),
            presigned_url: cvUpload.presigned_url
          })
          setSaveMessage('CV subido exitosamente!')
          setUploadedCVFile(null) // Limpiar el archivo pendiente
        }
      }
      
      // Si se subió un archivo de LinkedIn, mostrar mensaje de éxito y actualizar estado
      if (uploadedLinkedInFile && result.fileUploads) {
        const linkedinUpload = result.fileUploads.find(upload => upload.file_type === 'linkedin')
        if (linkedinUpload) {
          setSaveMessage(`Perfil de LinkedIn (${uploadedLinkedInFile.importType.toUpperCase()}) importado exitosamente!`)
          
          // LinkedIn upload data received
          setCurrentLinkedIn({
            file_key: linkedinUpload.file_key,
            filename: linkedinUpload.filename || (uploadedLinkedInFile.file ? uploadedLinkedInFile.file.name : 'linkedin-profile'),
            mime: linkedinUpload.mime,
            size: linkedinUpload.size || (uploadedLinkedInFile.file ? uploadedLinkedInFile.file.size : null),
            fileType: 'linkedin',
            uploadedAt: new Date().toISOString(),
            presigned_url: linkedinUpload.presigned_url
          })
          setUploadedLinkedInFile(null) // Limpiar el archivo pendiente
        }
      }
      
      // Si se subió una imagen, actualizar el estado con la respuesta del backend
      if (userAvatar && result.fileUploads) {
        const photoUpload = result.fileUploads.find(upload => upload.file_type === 'photo')
        if (photoUpload) {
          // Actualizar el estado con la información del backend
          const filename = photoUpload.file_key.split('/').pop() || 'profile-photo.jpg'
          setUserAvatar({
            imageUrl: photoUpload.presigned_url,
            filename: filename,
            useForCV: userAvatar.useForCV || false,
            cropSettings: userAvatar.cropSettings || {},
            needsUpload: false  // Ya no necesita ser subido
          })
          // Profile picture updated successfully
        }
      }
      
      // Solo mostrar mensaje general si no hay mensaje específico
      if (!saveMessage || saveMessage === '') {
        setSaveMessage('Cambios guardados exitosamente!')
      }
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSaveMessage(''), 3000)
      
    } catch (error) {
      console.error('Error guardando cambios:', error)
      setSaveMessage(`Error al guardar los cambios: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  // Verificar si hay cambios pendientes
  const hasPendingChanges = Object.keys(pendingChanges).length > 0 || 
                           (uploadedCVFile && (uploadedCVFile.file || uploadedCVFile instanceof File)) || 
                           (uploadedLinkedInFile && (uploadedLinkedInFile.file || uploadedLinkedInFile instanceof File)) || 
                           (userAvatar && userAvatar.needsUpload)


  return (
    <div>
      {/* Modal de cambio de contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
            {/* Botón cerrar */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Contenido dinámico según el paso */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Cambiar contraseña
              </h1>
              
              {modalStep === 'confirm' ? (
                // Paso 1: Confirmación
                <>
                  <p className="text-gray-600 font-medium">
                    Se te enviará un mail a tu dirección de correo
                  </p>
                  <p className="text-gray-600 mb-6 font-medium">
                    electrónico: <span>{user.email}</span>
                  </p>
                  
                  <p className="text-gray-700 mb-8 font-medium">
                    ¿Deseas continuar?
                  </p>
                  
                  <div>
                    <button
                      onClick={handlePasswordChangeConfirm}
                      className="bg-blue-600 cursor-pointer text-white px-8 py-1 rounded-2xl font-medium"
                    >
                      Aceptar
                    </button>
                  </div>
                </>
              ) : (
                // Paso 2: Éxito
                <>
                  <p className="text-gray-600 mb-6">
                    Se ha enviado el correo con éxito. Continúa los pasos desde el link enviado.
                  </p>
                  
                  {/* Icono de éxito */}
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1.5">
                    <Check className="w-10 h-10 text-blue-600"/>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de cambio de avatar */}
      <ImageModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onSave={handleAvatarSave}
        currentAvatar={userAvatar}
      />

      {/* Modal de importar LinkedIn */}
      <LinkedInImportModal
        isOpen={showLinkedInModal}
        onClose={() => setShowLinkedInModal(false)}
        onSave={handleLinkedInSave}
      />

      {/* Título de la sección */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
          Mis Datos
        </h1>
      </div>

      {/* Datos personales */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Nombre */}
        <div>
          <h3 className="text-2xl font-medium text-gray-800 mb-4">Nombre</h3>
          <UserHomeInput
            value={user.firstName}
            onChange={(newValue) => handleFieldChange('firstName', newValue)}
            placeholder="Ingresa tu nombre"
          />
        </div>

        {/* Apellido */}
        <div>
          <h3 className="text-2xl font-medium text-gray-800 mb-4">Apellido</h3>
          <UserHomeInput
            value={user.lastName}
            onChange={(newValue) => handleFieldChange('lastName', newValue)}
            placeholder="Ingresa tu apellido"
          />
        </div>

        {/* Avatar - ACTUALIZADO */}
        <div className="md:row-span-2 flex justify-center items-center">
          <div className="relative">
            <div className="w-24 h-24 md:w-48 md:h-48 bg-gray-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              {userAvatar && userAvatar.imageUrl ? (
                <img 
                  src={userAvatar.imageUrl} 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-white">
                  <User className="w-12 h-12 md:w-24 md:h-24 text-white" />
                  <span className="text-xs mt-1">Sin foto</span>
                </div>
              )}
            </div>
            <button
              onClick={handleAvatarChange}
              className="absolute bottom-0 right-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Contraseña */}
        <div>
          <h3 className="text-2xl font-medium text-gray-800 mb-4">Contraseña</h3>
          <UserHomeInput
            type="password"
            value="••••••••••••"
            showEditIcon={false}
            placeholder="Contraseña"
          />
          <button 
            onClick={handlePasswordChange}
            className="text-blue-600 cursor-pointer text-sm font-medium mt-3 transition-colors"
          >
            Cambiar contraseña
          </button>
        </div>

        {/* Correo */}
        <div>
          <h3 className="text-2xl font-medium text-gray-800 mb-4">Correo</h3>
          <UserHomeInput
            type="email"
            value={user.email}
            onChange={(newValue) => handleFieldChange('email', newValue)}
            placeholder="Ingresa tu email"
          />
        </div>
      </div>

      {/* Carga tu CV */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
          Carga tu CV
        </h2>
        
        {/* CV actual o pendiente */}
        {(currentCV || uploadedCVFile) && (
          <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {/* Ícono del archivo según tipo */}
              {uploadedCVFile ? (
                uploadedCVFile.file ? 
                  getFileIcon(uploadedCVFile.file) : 
                  getFileIcon(uploadedCVFile)
              ) : (
                currentCV && currentCV.filename && currentCV.mime ? 
                  getFileIcon({ name: currentCV.filename, type: currentCV.mime }) : 
                  null
              )}
              
              {/* Información del archivo */}
              <div>
                <p className="text-gray-800 font-medium truncate max-w-xs">
                  {uploadedCVFile ? (
                    uploadedCVFile.file ? uploadedCVFile.file.name : uploadedCVFile.name
                  ) : (
                    currentCV?.filename || 'Nombre no disponible'
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {uploadedCVFile ? (
                    uploadedCVFile.file ? 
                      `${(uploadedCVFile.file.size / (1024 * 1024)).toFixed(2)} MB` : 
                      uploadedCVFile.size ? `${(uploadedCVFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Tamaño no disponible'
                  ) : (
                    currentCV?.size ? `${(currentCV.size / (1024 * 1024)).toFixed(2)} MB` : 'Tamaño no disponible'
                  )}
                </p>
                <p className={`text-xs font-medium ${uploadedCVFile ? 'text-blue-600' : 'text-green-600'}`}>
                  {uploadedCVFile ? 'Nuevo archivo - Pendiente de guardar' : 'CV actual guardado'}
                </p>
              </div>
            </div>

            {/* Botón cambiar CV o eliminar */}
            <button
              onClick={() => {
                if (uploadedCVFile) {
                  // Si hay archivo pendiente, eliminarlo
                  setUploadedCVFile(null)
                } else {
                  // Si hay CV actual, activar input para cambiar
                  const fileInput = document.getElementById('cv-upload-hidden')
                  if (fileInput) {
                    fileInput.click()
                  }
                }
              }}
              className={`p-2 rounded-lg transition-colors ${
                uploadedCVFile 
                  ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                  : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
              title={uploadedCVFile ? 'Eliminar archivo' : 'Cambiar CV'}
            >
              {uploadedCVFile ? <Trash2 className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
            </button>
          </div>
        )}
        
        {/* Área de carga cuando no hay CV */}
        {!currentCV && !uploadedCVFile && (
          <div
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            className="block border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:border-blue-400 transition-colors bg-gray-50"
          >
            <label htmlFor="cv-upload" className="cursor-pointer block">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Arrastra un archivo PDF hasta aquí o{" "}
                <span className="text-blue-600 hover:text-blue-700 font-medium underline">
                  súbelo
                </span>
              </p>
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="cv-upload"
            />
          </div>
        )}
        
        <p className="text-sm text-gray-500 mt-4">
          Solo se permiten archivos PDF para la mejor calidad de extracción
        </p>
      </div>

      {/* Perfil de LinkedIn */}
      <div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
          Perfil de LinkedIn
        </h2>
        
        {/* Perfil de LinkedIn actual o pendiente */}
        {(currentLinkedIn || uploadedLinkedInFile) && (
          <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {/* Ícono del archivo según tipo */}
              {uploadedLinkedInFile ? (
                getFileIcon(uploadedLinkedInFile.file)
              ) : (
                getFileIcon({ name: currentLinkedIn.filename, type: currentLinkedIn.mime })
              )}
              
              {/* Información del archivo */}
              <div>
                <p className="text-gray-800 font-medium truncate max-w-xs">
                  {uploadedLinkedInFile ? (
                    uploadedLinkedInFile.file.name
                  ) : (
                    currentLinkedIn.filename
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {uploadedLinkedInFile ? (
                    `${(uploadedLinkedInFile.file.size / (1024 * 1024)).toFixed(2)} MB`
                  ) : (
                    currentLinkedIn.size ? `${(currentLinkedIn.size / (1024 * 1024)).toFixed(2)} MB` : 'Tamaño no disponible'
                  )}
                </p>
                <p className={`text-xs font-medium ${uploadedLinkedInFile ? 'text-blue-600' : 'text-green-600'}`}>
                  {uploadedLinkedInFile ? 
                    `Perfil de LinkedIn (${uploadedLinkedInFile.importType.toUpperCase()}) - Pendiente de guardar` : 
                    'Perfil de LinkedIn actual guardado'
                  }
                </p>
              </div>
            </div>

            {/* Botón cambiar perfil o eliminar */}
            <button
              onClick={() => {
                if (uploadedLinkedInFile) {
                  // Si hay archivo pendiente, eliminarlo
                  setUploadedLinkedInFile(null)
                } else {
                  // Si hay perfil actual, abrir modal para cambiar
                  setShowLinkedInModal(true)
                }
              }}
              className={`p-2 rounded-lg transition-colors ${
                uploadedLinkedInFile 
                  ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                  : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
              title={uploadedLinkedInFile ? 'Eliminar archivo' : 'Cambiar perfil de LinkedIn'}
            >
              {uploadedLinkedInFile ? <Trash2 className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
            </button>
          </div>
        )}
        
        {/* Botón de importar cuando no hay perfil */}
        {!currentLinkedIn && !uploadedLinkedInFile && (
          <LoginButton
            variant="primary"
            icon={Linkedin}
            onClick={handleLinkedInImport}
            className="max-w-md drop-shadow-md cursor-pointer"
          >
            Importar perfil de LinkedIn
          </LoginButton>
        )}
      </div>

      {/* Input de archivo oculto para CV - siempre disponible */}
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
        id="cv-upload-hidden"
      />

      {/* Botón Guardar Cambios */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col items-end space-y-3">
          <LoginButton
            variant="primary"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (!isSaving) {
                handleSaveChanges()
              }
            }}
            disabled={!hasPendingChanges || isSaving}
            className={`min-w-[200px] ${
              !hasPendingChanges 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-600'
            }`}
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </LoginButton>
          
          {saveMessage && (
            <p className={`text-sm ${
              saveMessage.includes('Error') 
                ? 'text-red-600' 
                : saveMessage.includes('No hay cambios') 
                  ? 'text-gray-500' 
                  : 'text-green-600'
            }`}>
              {saveMessage}
            </p>
          )}
        </div>
      </div>
      {/* Modal de restricción de suscripción */}
      <SubscriptionRestrictionModal
        isOpen={isRestrictionModalOpen}
        onClose={closeRestrictionModal}
        feature={restrictedFeature}
        title="Funcionalidad no disponible"
        showUpgradeButton={true}
      />
    </div>
  )
}