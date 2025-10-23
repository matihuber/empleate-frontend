import { useState } from 'react'
import { HelpCircle, FileText, Shield, ChevronDown, X, Check } from 'lucide-react'

const Configuration = () => {
  const [profileType, setProfileType] = useState('cambio-empresa')
  const [province, setProvince] = useState('capital-federal')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Provincias argentinas
  const provinces = [
    { value: 'capital-federal', label: 'Capital Federal' },
    { value: 'buenos-aires', label: 'Buenos Aires' },
    { value: 'catamarca', label: 'Catamarca' },
    { value: 'chaco', label: 'Chaco' },
    { value: 'chubut', label: 'Chubut' },
    { value: 'cordoba', label: 'Córdoba' },
    { value: 'corrientes', label: 'Corrientes' },
    { value: 'entre-rios', label: 'Entre Ríos' },
    { value: 'formosa', label: 'Formosa' },
    { value: 'jujuy', label: 'Jujuy' },
    { value: 'la-pampa', label: 'La Pampa' },
    { value: 'la-rioja', label: 'La Rioja' },
    { value: 'mendoza', label: 'Mendoza' },
    { value: 'misiones', label: 'Misiones' },
    { value: 'neuquen', label: 'Neuquén' },
    { value: 'rio-negro', label: 'Río Negro' },
    { value: 'salta', label: 'Salta' },
    { value: 'san-juan', label: 'San Juan' },
    { value: 'san-luis', label: 'San Luis' },
    { value: 'santa-cruz', label: 'Santa Cruz' },
    { value: 'santa-fe', label: 'Santa Fe' },
    { value: 'santiago-del-estero', label: 'Santiago del Estero' },
    { value: 'tierra-del-fuego', label: 'Tierra del Fuego' },
    { value: 'tucuman', label: 'Tucumán' }
  ]

  // Tipos de perfil
  const profileTypes = [
    { value: 'primer-empleo', label: 'Busco mi primer empleo' },
    { value: 'desempleado', label: 'Profesional en búsqueda activa' },
    { value: 'cambio-empresa', label: 'Cambio de empresa' }
  ]

  const handleSaveChanges = () => {
    console.log('Guardando cambios:', { profileType, province })
    setShowSuccessModal(true)
  }

  const handleDeleteAccount = () => {
    setShowDeleteModal(true)
  }

  const confirmDeleteAccount = () => {
    console.log('Eliminando cuenta...')
    setShowDeleteModal(false)
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
          Configuración
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
        {/* Columna Izquierda - Preferencias y Suscripción */}
        <div className="space-y-6">
          {/* Preferencias */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Preferencias</h2>
            
            <div className="space-y-4">
              {/* Tipo de perfil */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de perfil
                </label>
                <div className="relative">
                  <select
                    value={profileType}
                    onChange={(e) => setProfileType(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    {profileTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Provincia de residencia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provincia de residencia
                </label>
                <div className="relative">
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    {provinces.map(prov => (
                      <option key={prov.value} value={prov.value}>
                        {prov.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Botón guardar cambios */}
              <button 
                onClick={handleSaveChanges}
                className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer">
                Guardar cambios
              </button>
            </div>
          </div>

          {/* Suscripción */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Suscripción</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Plan</p>
                <p className="text-lg font-medium text-gray-900">Básico</p>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer">
                Actualizar
              </button>
            </div>
          </div>

          {/* Cerrar cuenta */}
          <button 
            onClick={handleDeleteAccount}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer">
            Cerrar cuenta
          </button>
        </div>

        {/* Columna Derecha - Acerca de */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Acerca de</h2>
              
              {/* Ayuda */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Ayuda</h3>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">FAQs</span>
                  </a>
                  
                  <a
                    href="#"
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <FileText className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Términos y condiciones</span>
                  </a>
                  
                  <a
                    href="#"
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Shield className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Política de privacidad</span>
                  </a>
                </div>
              </div>

              {/* Soporte */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Soporte</h3>
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer">
                  Reportar un problema
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl relative">
            {/* Botón cerrar */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-2">
                Cambios guardados
              </h1>
              
              <p className="text-gray-600 font-medium mb-6">
                  Se han guardado correctamente tus preferencias
              </p>
              
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1.5">
                    <Check className="w-10 h-10 text-blue-600"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de cerrar cuenta */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl relative">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-2">
                  Cerrar cuenta
              </h1>
              <p className="text-gray-600 font-medium mb-6">
                    ¿Estás seguro que deseas cerrar tu cuenta de manera permanente?
              </p>

              <div className="flex justify-center">
                <button
                  onClick={confirmDeleteAccount}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Cerrar cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Configuration