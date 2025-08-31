import { useState, useEffect } from "react"
import { User, Upload, Camera, Linkedin, X, Check, Trash2 } from "lucide-react"
import UserHomeInput from "../../../components/UserHomeInput"
import LoginButton from "../../../components/LoginButton"
import ImageModal from "../../../components/ImageModal"
import LinkedInImportModal from "../../../components/LinkedInImportModal"
import userProfileService from "../../../services/userProfileService"
import imageCacheService from "../../../services/imageCacheService"

export default function MisDatosSection({ user }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [modalStep, setModalStep] = useState('confirm')
  const [userAvatar, setUserAvatar] = useState(user.avatar || null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [showLinkedInModal, setShowLinkedInModal] = useState(false)
  
  // Estados para cambios pendientes
  const [pendingChanges, setPendingChanges] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Cargar imagen del usuario cuando se monta el componente
  useEffect(() => {
    console.log('MisDatosSection: useEffect [user] ejecutado, user:', user)
    console.log('MisDatosSection: user.sub disponible:', user.sub)
    
    const loadUserAvatar = async () => {
      try {
        // Primero intentar obtener del cache
        const cachedAvatar = imageCacheService.getImage(user.sub, 'profile')
        if (cachedAvatar) {
          console.log('MisDatosSection: Avatar cargado desde cache:', cachedAvatar)
          setUserAvatar(cachedAvatar)
          return
        }

        console.log('MisDatosSection: Cache miss, cargando desde backend para usuario:', user.sub)
        // Obtener la imagen del usuario desde el backend
        const avatarData = await userProfileService.getUserAvatar(user.sub)
        if (avatarData && avatarData.imageUrl) {
          // Guardar en cache para futuras cargas
          imageCacheService.setImage(user.sub, 'profile', avatarData)
          setUserAvatar(avatarData)
          console.log('MisDatosSection: Avatar cargado desde backend y cacheado:', avatarData)
        } else {
          console.log('MisDatosSection: No se encontró avatar para el usuario')
        }
      } catch (error) {
        console.log('MisDatosSection: No se pudo cargar la imagen del usuario:', error)
        // Si no hay imagen, mantener el estado por defecto
      }
    }

    if (user && user.sub) {
      loadUserAvatar()
    } else {
      console.log('MisDatosSection: No hay usuario válido para cargar avatar')
      console.log('MisDatosSection: user object completo:', user)
    }
  }, [user])

  // Recargar imagen cuando cambie userAvatar (para casos de actualización)
  useEffect(() => {
    if (userAvatar && userAvatar.imageUrl && !userAvatar.imageUrl.startsWith('data:')) {
      // Si ya tenemos una imagen válida del backend, no hacer nada
      return
    }
    
    // Si no hay imagen o es una imagen temporal (base64), cargar desde el backend
    if (user && user.sub) {
      const loadUserAvatar = async () => {
        try {
          const avatarData = await userProfileService.getUserAvatar(user.sub)
          if (avatarData && avatarData.imageUrl) {
            setUserAvatar(avatarData)
          }
        } catch (error) {
          console.log('No se pudo recargar la imagen del usuario:', error)
        }
      }
      loadUserAvatar()
    }
  }, [userAvatar, user])

  const handleFieldChange = (field, newValue) => {
    console.log(`Actualizando ${field}:`, newValue)
    // Guardar cambio pendiente
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
    console.log("Enviar email para cambiar contraseña")
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
      console.log("Archivo cargado:", file.name)
      setUploadedFile(file)
      // Aquí iría la lógica para procesar el archivo
    }
  }

  const handleFileDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && (file.type === 'application/pdf' || file.type.includes('word') || file.name.endsWith('.docx'))) {
      console.log("Archivo arrastrado:", file.name)
      setUploadedFile(file)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  const getFileIcon = (file) => {
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      return (
        <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      )
    } else if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      return (
        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
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
    console.log("Guardando avatar:", avatarData)
    setUserAvatar(avatarData)  // Guardar el objeto completo, no solo imageUrl
    // Aquí iría la lógica para subir la imagen al servidor
    // También podrías usar avatarData.useForCV y avatarData.cropSettings
  }

  const handleLinkedInImport = () => {
    setShowLinkedInModal(true)
  }

  const handleLinkedInSave = (file) => {
    console.log("Archivo de LinkedIn cargado:", file.name)
    // Procesar el archivo ZIP de LinkedIn
  }

  // Función para guardar todos los cambios pendientes
  const handleSaveChanges = async () => {
    if (Object.keys(pendingChanges).length === 0 && !uploadedFile && !userAvatar) {
      setSaveMessage('No hay cambios para guardar')
      return
    }

    setIsSaving(true)
    setSaveMessage('')

    try {
      // Llamar al servicio para guardar todos los cambios
      const result = await userProfileService.saveAllChanges({
        pendingChanges,
        uploadedFile,
        userAvatar
      })

      console.log('Resultado del guardado:', result)

      // Limpiar cambios pendientes
      setPendingChanges({})
      setUploadedFile(null)
      
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
            cropSettings: userAvatar.cropSettings || {}
          })
          console.log('Avatar actualizado con respuesta del backend:', photoUpload)
        }
      }
      
      setSaveMessage('Cambios guardados exitosamente!')
      
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
  const hasPendingChanges = Object.keys(pendingChanges).length > 0 || uploadedFile || userAvatar

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
        <div className="md:row-span-2 flex justify-center md:justify-center items-center">
          <div className="relative">
            <div className="w-24 h-24 md:w-48 md:h-48 bg-gray-400 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              {userAvatar && userAvatar.imageUrl ? (
                <img 
                  src={userAvatar.imageUrl} 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 md:w-24 md:h-24 text-white" />
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
        
        {!uploadedFile ? (
          // Área de carga cuando no hay archivo
          <div
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            className="block border-3 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:border-blue-400 transition-colors bg-gray-200"
          >
            <label htmlFor="cv-upload" className="cursor-pointer block">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Arrastra un archivo hasta aquí o{" "}
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  súbelo
                </span>
              </p>
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileUpload}
              className="hidden"
              id="cv-upload"
            />
          </div>
        ) : (
          // Mostrar archivo cargado
          <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Ícono del archivo según tipo */}
              {getFileIcon(uploadedFile)}
              
              {/* Información del archivo */}
              <div>
                <p className="text-gray-800 font-medium truncate max-w-xs">
                  {uploadedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            {/* Botón eliminar */}
            <button
              onClick={removeFile}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar archivo"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
        
        <p className="text-sm text-gray-500 mt-4">
          Los tipos de archivos permitidos son PDF y DOCX
        </p>
      </div>

      {/* Perfil de LinkedIn */}
      <div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
          Perfil de LinkedIn
        </h2>
        
        <LoginButton
          variant="primary"
          icon={Linkedin}
          onClick={handleLinkedInImport}
          className="max-w-md drop-shadow-md cursor-pointer"
        >
          Importar perfil de LinkedIn
        </LoginButton>
      </div>

      {/* Botón Guardar Cambios */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col items-end space-y-3">
          <LoginButton
            variant="primary"
            onClick={handleSaveChanges}
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
    </div>
  )
}