import { useState } from "react"
import { User, Upload, Camera, Linkedin, X, Check } from "lucide-react"
import UserHomeInput from "../../../components/UserHomeInput"
import LoginButton from "../../../components/LoginButton"
import ImageModal from "../../../components/ImageModal"

export default function MisDatosSection({ user }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [modalStep, setModalStep] = useState('confirm')
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [userAvatar, setUserAvatar] = useState(user.avatar || null)

  const handleFieldChange = (field, newValue) => {
    console.log(`Actualizando ${field}:`, newValue)
    // Aquí iría la lógica para actualizar el campo en el estado/API
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
      // Aquí iría la lógica para procesar el archivo
    }
  }

  const handleLinkedInImport = () => {
    console.log("Importar perfil de LinkedIn")
    // Aquí iría la lógica para importar perfil de LinkedIn
  }

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      console.log("Imagen de perfil cargada:", file.name)
      // Aquí iría la lógica para actualizar la imagen de perfil
    }
  }

  const handleAvatarChange = () => {
    setShowAvatarModal(true)
  }

  const handleAvatarSave = (avatarData) => {
    console.log("Guardando avatar:", avatarData)
    setUserAvatar(avatarData.imageUrl)
    // Aquí iría la lógica para subir la imagen al servidor
    // También podrías usar avatarData.useForCV y avatarData.cropSettings
  }

  return (
    <div>
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

      <ImageModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onSave={handleAvatarSave}
        currentAvatar={userAvatar}
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

        {/* Avatar */}
        <div className="md:row-span-2 flex justify-center md:justify-center items-center">
          <div className="relative">
            <div className="w-24 h-24 md:w-48 md:h-48 bg-gray-400 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              {userAvatar ? (
                <img 
                  src={userAvatar} 
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
        
        <label 
          htmlFor="cv-upload"
          className="block border-3 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-200"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Arrastra un archivo hasta aquí o{" "}
            <span className="text-blue-600 hover:text-blue-700 font-medium">
              súbelo
            </span>
          </p>
          <input
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={handleFileUpload}
            className="hidden"
            id="cv-upload"
          />
        </label>
        
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
          className="max-w-md drop-shadow-md"
        >
          Importar perfil de LinkedIn
        </LoginButton>
      </div>
    </div>
  )
}