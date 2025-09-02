import { useState, useEffect } from "react"
import { User, Upload, Camera, Linkedin, X, Check, Trash2 } from "lucide-react"
import UserHomeInput from "../../../components/UserHomeInput"
import LoginButton from "../../../components/LoginButton"
import ImageModal from "../../../components/ImageModal"
import LinkedInImportModal from "../../../components/LinkedInImportModal"
import userProfileService from "../../../services/userProfileService"
import imageCacheService from "../../../services/imageCacheService"
import apiInterceptor from "../../../services/apiInterceptor"


export default function MisDatosSection({ user }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [modalStep, setModalStep] = useState('confirm')
  const [userAvatar, setUserAvatar] = useState(null)
  const [currentCV, setCurrentCV] = useState(null)  // CV actual del usuario
  const [currentLinkedIn, setCurrentLinkedIn] = useState(null)  // Perfil de LinkedIn actual del usuario
  const [uploadedFile, setUploadedFile] = useState(null)
  const [showLinkedInModal, setShowLinkedInModal] = useState(false)

  
  // Estados para cambios pendientes
  const [pendingChanges, setPendingChanges] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')



  // Cargar imagen del usuario cuando se monta el componente
  useEffect(() => {

    console.log('MisDatosSection: Cargando datos del usuario')
    
    // Limpiar cache del usuario para empezar limpio (solo en desarrollo)
    // imageCacheService.clearUserCache(user.sub)
    
    const loadUserAvatar = async () => {
      try {
        // Primero intentar obtener del cache
        const cachedAvatar = imageCacheService.getImage(user.sub, 'profile')
        // console.log('MisDatosSection: Cached avatar:', cachedAvatar)
        if (cachedAvatar && cachedAvatar.imageUrl) {
          console.log('MisDatosSection: Foto de perfil cargada desde cache')
          // Marcar que NO necesita ser subido (ya existe en el servidor)
          setUserAvatar({
            ...cachedAvatar,
            needsUpload: false
          })
          return
        }

        console.log('MisDatosSection: Cargando foto de perfil desde backend')
        // Obtener la imagen del usuario desde el backend
        const avatarData = await userProfileService.getUserAvatar(user.sub)
        if (avatarData && avatarData.imageUrl) {
          // Guardar en cache para futuras cargas
          imageCacheService.setImage(user.sub, 'profile', avatarData)
          // Marcar que NO necesita ser subido (ya existe en el servidor)
          setUserAvatar({
            ...avatarData,
            needsUpload: false
          })
          console.log('MisDatosSection: Foto de perfil cargada desde backend')
        } else {
          console.log('MisDatosSection: No se encontró foto de perfil')
          // Asegurar que el estado sea null cuando no hay avatar
          setUserAvatar(null)
        }
      } catch (error) {
        console.log('MisDatosSection: Error al cargar foto de perfil')
        // Si no hay imagen, mantener el estado por defecto
        setUserAvatar(null)
      }
    }

    if (user && user.sub) {
      loadUserAvatar()
    } else {
              console.log('MisDatosSection: Usuario no válido para cargar foto de perfil')
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
          console.log('🔍 MisDatosSection: CV data from backend:', cvData)
          setCurrentCV(cvData)
          console.log('MisDatosSection: CV cargado exitosamente')
        }
      } catch (error) {
        console.log('MisDatosSection: No se encontró CV cargado (esto es normal si no has subido un CV)')
      }
    }

    if (user && user.sub) {
      loadCurrentCV()
      
      // Cargar perfil de LinkedIn actual
      const loadCurrentLinkedIn = async () => {
        try {
          const linkedinData = await userProfileService.getUserLinkedIn(user.sub)
          if (linkedinData) {
            console.log('🔍 MisDatosSection: LinkedIn data from backend:', linkedinData)
            setCurrentLinkedIn(linkedinData)
            console.log('MisDatosSection: Perfil de LinkedIn cargado exitosamente')
          }
        } catch (error) {
          console.log('MisDatosSection: No se encontró perfil de LinkedIn (esto es normal si no has importado tu perfil)')
        }
      }
      
      loadCurrentLinkedIn()
    }
  }, [user?.sub]) // Solo ejecutar cuando cambie user.sub, no todo el objeto user

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
    if (file && file.type === 'application/pdf') {
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
    console.log("Guardando avatar:", avatarData)
    // Marcar que SÍ necesita ser subido (es una nueva imagen)
    setUserAvatar({
      ...avatarData,
      needsUpload: true
    })
    // Aquí iría la lógica para subir la imagen al servidor
    // También podrías usar avatarData.useForCV y avatarData.cropSettings
  }

  const handleLinkedInImport = () => {
    setShowLinkedInModal(true)
  }

  const handleLinkedInSave = (data) => {
    console.log("Archivo de LinkedIn cargado:", data.file.name, "Tipo:", data.importType)
    
    // Marcar que hay un archivo de LinkedIn pendiente de subir
    setUploadedFile({
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
            console.log('MisDatos: Guardando cambios')
    
    if (Object.keys(pendingChanges).length === 0 && !(uploadedFile && (uploadedFile.file || uploadedFile instanceof File)) && !userAvatar) {
      setSaveMessage('No hay cambios para guardar')
      return
    }

    setIsSaving(true)
    setSaveMessage('')

    try {
      // Llamar al servicio para guardar todos los cambios
      const result = await userProfileService.saveAllChanges({
        pendingChanges,
        uploadedFile: uploadedFile && (uploadedFile.file || uploadedFile instanceof File) ? uploadedFile : null,
        userAvatar
      })

      console.log('Resultado del guardado:', result)

      // Limpiar cambios pendientes
      setPendingChanges({})
      setUploadedFile(null)
      
      // Si se subió un archivo CV, mostrar mensaje de éxito y actualizar estado
      if (uploadedFile && uploadedFile.type !== 'linkedin' && result.fileUploads) {
        const cvUpload = result.fileUploads.find(upload => upload.file_type === 'cv')
        if (cvUpload) {
          console.log('🔍 MisDatosSection: CV upload data from backend:', cvUpload)
          setCurrentCV({
            file_key: cvUpload.file_key,
            filename: cvUpload.filename || 'cv-uploaded',
            mime: cvUpload.mime,
            size: cvUpload.size,
            fileType: 'cv',
            uploadedAt: new Date().toISOString(),
            presigned_url: cvUpload.presigned_url
          })
          setSaveMessage('CV subido exitosamente!')
          console.log('CV actualizado exitosamente')
        }
      }
      
      // Si se subió un archivo de LinkedIn, mostrar mensaje de éxito y actualizar estado
      if (uploadedFile && uploadedFile.type === 'linkedin') {
        setSaveMessage(`Perfil de LinkedIn (${uploadedFile.importType.toUpperCase()}) importado exitosamente!`)
        
        // Actualizar el estado con la información del backend
        if (result.fileUploads) {
          const linkedinUpload = result.fileUploads.find(upload => upload.file_type === 'linkedin')
          if (linkedinUpload) {
            console.log('🔍 MisDatosSection: LinkedIn upload data from backend:', linkedinUpload)
            setCurrentLinkedIn({
              file_key: linkedinUpload.file_key,
              filename: linkedinUpload.filename || 'linkedin-profile',
              mime: linkedinUpload.mime,
              size: linkedinUpload.size,
              fileType: 'linkedin',
              uploadedAt: new Date().toISOString(),
              presigned_url: linkedinUpload.presigned_url
            })
            console.log('Perfil de LinkedIn actualizado exitosamente')
          }
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
          console.log('Foto de perfil actualizada exitosamente')
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
                           (uploadedFile && (uploadedFile.file || uploadedFile instanceof File)) || 
                           (userAvatar && userAvatar.needsUpload)

  // Debug: Log del estado para diagnosticar
  console.log('MisDatos Debug:', {
    pendingChanges: Object.keys(pendingChanges).length,
    uploadedFile: uploadedFile ? {
      hasFile: !!(uploadedFile.file || uploadedFile instanceof File),
      isFile: uploadedFile instanceof File,
      hasFileProp: !!uploadedFile.file,
      type: typeof uploadedFile
    } : null,
    userAvatar: userAvatar ? { needsUpload: userAvatar.needsUpload } : null,
    hasPendingChanges
  })

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
        
        {!uploadedFile && !currentCV ? (
          // Área de carga cuando no hay archivo ni CV actual
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
        ) : uploadedFile ? (
          // Mostrar archivo nuevo cargado (pendiente de guardar)
          <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Ícono del archivo según tipo */}
              {uploadedFile && uploadedFile.file ? 
                getFileIcon(uploadedFile.file) : 
                getFileIcon(uploadedFile)
              }
              
              {/* Información del archivo */}
              <div>
                <p className="text-gray-800 font-medium truncate max-w-xs">
                  {uploadedFile.file ? uploadedFile.file.name : uploadedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {uploadedFile.file ? 
                    `${(uploadedFile.file.size / (1024 * 1024)).toFixed(2)} MB` : 
                    uploadedFile.size ? `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Tamaño no disponible'
                  }
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  {uploadedFile.type === 'linkedin' ? 
                    `Perfil de LinkedIn (${uploadedFile.importType.toUpperCase()}) - Pendiente de guardar` : 
                    'Nuevo archivo - Pendiente de guardar'
                  }
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
        ) : (
          // Mostrar CV actual guardado
          <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Ícono del archivo según tipo */}
              {currentCV && currentCV.filename && currentCV.mime ? 
                getFileIcon({ name: currentCV.filename, type: currentCV.mime }) : 
                null
              }
              
              {/* Información del archivo */}
              <div>
                <p className="text-gray-800 font-medium truncate max-w-xs">
                  {currentCV?.filename || 'Nombre no disponible'}
                </p>
                <p className="text-sm text-gray-500">
                  {currentCV?.size ? `${(currentCV.size / (1024 * 1024)).toFixed(2)} MB` : 'Tamaño no disponible'}
                </p>
                <p className="text-xs text-green-600 font-medium">
                  CV actual guardado
                </p>
              </div>
            </div>

            {/* Botón cambiar CV */}
            <button
              onClick={() => {
                setCurrentCV(null)  // Ocultar CV actual
                setUploadedFile(null)  // Limpiar archivo pendiente
              }}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              title="Cambiar CV"
            >
              <Upload className="w-5 h-5" />
            </button>
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
        
        {currentLinkedIn ? (
          // Mostrar perfil de LinkedIn actual guardado
          <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Ícono del archivo según tipo */}
              {getFileIcon({ name: currentLinkedIn.filename, type: currentLinkedIn.mime })}
              
              {/* Información del archivo */}
              <div>
                <p className="text-gray-800 font-medium truncate max-w-xs">
                  {currentLinkedIn.filename}
                </p>
                <p className="text-sm text-gray-500">
                  {currentLinkedIn.size ? `${(currentLinkedIn.size / (1024 * 1024)).toFixed(2)} MB` : 'Tamaño no disponible'}
                </p>
                <p className="text-xs text-green-600 font-medium">
                  Perfil de LinkedIn actual guardado
                </p>
              </div>
            </div>

            {/* Botón cambiar perfil */}
            <button
              onClick={() => {
                setCurrentLinkedIn(null)  // Ocultar perfil actual
                setUploadedFile(null)  // Limpiar archivo pendiente
              }}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              title="Cambiar perfil de LinkedIn"
            >
              <Upload className="w-5 h-5" />
            </button>
          </div>
        ) : uploadedFile && uploadedFile.type === 'linkedin' ? (
          // Mostrar archivo nuevo cargado (pendiente de guardar)
          <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Ícono del archivo según tipo */}
              {getFileIcon(uploadedFile.file)}
              
              {/* Información del archivo */}
              <div>
                <p className="text-gray-800 font-medium truncate max-w-xs">
                  {uploadedFile.file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {`${(uploadedFile.file.size / (1024 * 1024)).toFixed(2)} MB`}
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  Perfil de LinkedIn ({uploadedFile.importType.toUpperCase()}) - Pendiente de guardar
                </p>
              </div>
            </div>

            {/* Botón eliminar */}
            <button
              onClick={() => {
                setUploadedFile(null)
                // Restaurar el perfil actual si existía
                if (currentLinkedIn) {
                  setCurrentLinkedIn(currentLinkedIn)
                }
              }}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar archivo"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ) : (
          // Mostrar botón de importar cuando no hay perfil
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
    </div>
  )
}