import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { HelpCircle, FileText, Shield, ChevronDown, X, Check } from 'lucide-react'
import ReportProblem from './ReportProblem'
import SubscriptionPlans from './Subscription'
import configService from '../../services/configService'
import { useAuth } from '../../contexts/AuthContext'
import { useSubscription } from '../../contexts/SubscriptionContext'
import TermsAndConditions from './TermsAndConditions'
import PrivacyPolicy from './PrivacyPolicy'
import FAQs from './FAQs'

const Configuration = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { logout, user } = useAuth()
  const { updateSubscriptionInfo } = useSubscription()
  const [profileType, setProfileType] = useState('busqueda-activa')
  const [province, setProvince] = useState('capital-federal')
  const [subscriptionTier, setSubscriptionTier] = useState('FREE')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentView, setCurrentView] = useState('main')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState(null)
  const [deleteError, setDeleteError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showFAQs, setShowFAQs] = useState(false)

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
    { value: 'pasantia', label: 'Buscando pasantía' },
    { value: 'sin-experiencia', label: 'Sin experiencia laboral' },
    { value: 'busqueda-pasiva', label: 'Búsqueda pasiva' },
    { value: 'busqueda-activa', label: 'Búsqueda activa' },
    { value: 'desempleado', label: 'Desempleado/a buscando trabajo' }
  ]

  const handleSaveChanges = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await configService.updatePreferences(profileType, province)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error saving preferences:', error)
      setError(error.message || 'Error al guardar las preferencias')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = () => {
    setDeleteError(null) // Limpiar error anterior
    setShowDeleteModal(true)
  }

  const confirmDeleteAccount = async () => {
    setIsDeleting(true)
    setDeleteError(null) // Limpiar error antes de intentar
    try {
      await configService.deleteAccount()
      // Logout y redirigir a home
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Error deleting account:', error)
      setDeleteError(error.message || 'Error al eliminar la cuenta')
      // NO cerrar el modal para que el usuario vea el error
    } finally {
      setIsDeleting(false)
    }
  }

  // Leer query param 'view' para navegar directamente a una sección
  useEffect(() => {
    const view = searchParams.get('view')
    if (view) {
      setCurrentView(view)
    } else {
      // Si no hay parámetro view, volver a la vista principal
      setCurrentView('main')
    }
  }, [searchParams])

  // Función para cargar preferencias del usuario
  const loadPreferences = useCallback(async () => {
    try {
      setIsLoadingData(true)
      const data = await configService.getPreferences()

      // Solo actualizar si los valores no son null
      if (data.profile_type) {
        setProfileType(data.profile_type)
      }
      if (data.province) {
        setProvince(data.province)
      }
      if (data.subscription_tier) {
        setSubscriptionTier(data.subscription_tier)
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
      // No mostrar error al usuario, usar valores por defecto
    } finally {
      setIsLoadingData(false)
    }
  }, [])

  // Cargar preferencias del usuario al montar el componente
  useEffect(() => {
    loadPreferences()
  }, [loadPreferences])

  // Recargar datos cuando se actualiza la suscripción (viene de checkout o cancelación)
  useEffect(() => {
    const subscriptionUpdated = searchParams.get('subscriptionUpdated')
    if (subscriptionUpdated === 'true' && user?.sub) {
      // Recargar datos de preferencias
      loadPreferences()
      // Actualizar información de suscripción desde el backend
      updateSubscriptionInfo(user.sub)
      // Limpiar los parámetros de la URL
      setTimeout(() => {
        navigate('/user-home?section=configuracion', { replace: true })
      }, 100)
    }
  }, [searchParams, loadPreferences, navigate, updateSubscriptionInfo, user?.sub])

  // Mapear tier a nombre legible
  const getSubscriptionName = (tier) => {
    // Normalizar a minúsculas para coincidir con los valores del backend
    const normalizedTier = tier?.toLowerCase();
    const tierMap = {
      'free': 'Básico',
      'pro': 'Pro',
      'premium': 'Premium'
    }
    return tierMap[normalizedTier] || 'Básico'
  }

  // Renderizar vista segun view
  if (currentView === 'report') {
    return <ReportProblem onBack={() => setCurrentView('main')} />
  }

  if (currentView === 'subscription') {
    return <SubscriptionPlans onBack={() => {
      // Navegar sin el parámetro view para permitir navegación a otras secciones
      navigate('/user-home?section=configuracion', { replace: true });
    }} />
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
          Configuración
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/*Preferencias y Suscripción */}
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
                    disabled={isLoadingData}
                    className={`w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                      isLoadingData ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
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
                    disabled={isLoadingData}
                    className={`w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                      isLoadingData ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
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

              {/* Mensaje de error para guardar cambios */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Botón guardar cambios */}
              <button
                onClick={handleSaveChanges}
                disabled={isLoading || isLoadingData}
                className={`w-full mt-4 py-3 px-4 rounded-lg transition-colors font-medium ${
                  isLoading || isLoadingData
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                } text-white`}>
                {isLoading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>

          {/* Suscripción */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Suscripción</h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Plan</p>
                {isLoadingData ? (
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
                ) : (
                  <p className="text-lg font-medium text-gray-900">{getSubscriptionName(subscriptionTier)}</p>
                )}
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                onClick={() => setCurrentView('subscription')}>
                Actualizar
              </button>
            </div>
          </div>

          {/* Cerrar cuenta */}
          <div className="pb-8"> 
            <button 
              onClick={handleDeleteAccount}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer">
              Cerrar cuenta
            </button>
          </div>
        </div>

        {/*Acerca de */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Acerca de</h2>
              
              {/* Ayuda */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Ayuda</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowFAQs(true)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer w-full text-left"
                  >
                    <HelpCircle className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">FAQs</span>
                  </button>
                  
                  <button
                    onClick={() => setShowTerms(true)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer w-full text-left"
                  >
                    <FileText className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Términos y condiciones</span>
                  </button>
                  
                  <button
                    onClick={() => setShowPrivacy(true)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer w-full text-left"
                  >
                    <Shield className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Política de privacidad</span>
                  </button>
                </div>
              </div>

              {/* Soporte */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Soporte</h3>
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                  onClick={() => setCurrentView('report')}>
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
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
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
              onClick={() => {
                setShowDeleteModal(false)
                setDeleteError(null) // Limpiar error al cerrar
              }}
              disabled={isDeleting}
              className={`absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10 ${
                isDeleting ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                  Cerrar cuenta
              </h1>
              <p className="text-gray-600 font-medium mb-6">
                    ¿Estás seguro que deseas cerrar tu cuenta de manera permanente?
              </p>

              {/* Mensaje de error dentro del modal */}
              {deleteError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{deleteError}</p>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={confirmDeleteAccount}
                  disabled={isDeleting}
                  className={`px-8 py-3 rounded-lg transition-colors font-medium text-white ${
                    isDeleting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isDeleting ? 'Eliminando...' : 'Cerrar cuenta'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Términos y Condiciones */}
      <TermsAndConditions 
        isOpen={showTerms} 
        onClose={() => setShowTerms(false)} 
      />

      {/* Modal de Política de Privacidad */}
      <PrivacyPolicy 
        isOpen={showPrivacy} 
        onClose={() => setShowPrivacy(false)} 
      />

      {/* Modal de FAQs */}
      <FAQs 
        isOpen={showFAQs} 
        onClose={() => setShowFAQs(false)} 
      />
    </div>
  )
}

export default Configuration