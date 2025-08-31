import { Bell, Edit, Linkedin, FileText, User, Camera } from "lucide-react"
import { useEffect, useState } from "react"
import authService from "../../../services/authService"
import apiInterceptor from "../../../services/apiInterceptor"
import { SessionExpired } from "../../../components"

export default function Inicio({ user }) {
  const [homeData, setHomeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sessionExpired, setSessionExpired] = useState(false)

  useEffect(() => {
    // Configurar el interceptor para manejar sesión expirada
    apiInterceptor.setOnSessionExpired(() => {
      setSessionExpired(true);
      setLoading(false);
    });

    const fetchHomeData = async () => {
      try {
        setLoading(true)
        setError(null)
        setSessionExpired(false)
        
        const token = authService.getAccessToken()
        if (!token) {
          throw new Error('No hay token de acceso')
        }

        console.log('🔍 Inicio: Token a enviar:', token.substring(0, 50) + '...')
        console.log('🔍 Inicio: URL:', 'http://localhost:8000/api/v1/home')

        const response = await apiInterceptor.fetchWithInterceptor('http://localhost:8000/api/v1/home', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        setHomeData(data)
      } catch (error) {
        console.error('Error fetching home data:', error)
        if (!error.message.includes('Sesión expirada')) {
          setError(error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  // Icon mapping for suggestions
  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'linkedin':
        return Linkedin
      case 'cv':
        return FileText
      case 'photo':
        return Camera
      case 'profile':
        return Edit
      default:
        return Edit
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (sessionExpired) {
    return <SessionExpired onRetry={() => window.location.reload()} />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error cargando datos: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Saludo con Avatar - Solo en sección Inicio */}
      <div className="mb-6 lg:mb-8 flex justify-between">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
          ¡Hola, {user.firstName}!
        </h1>
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-300 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-gray-600 font-medium text-sm md:text-base">{user.firstName.charAt(0)}</span>
        </div>
      </div>

      {/* Perfil Completo */}
      <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 mb-6 lg:mb-8">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-3 lg:mb-4">
          Perfil completo al {homeData?.profile_completion || 0}%
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-2 lg:h-3">
          <div 
            className="bg-blue-600 h-2 lg:h-3 rounded-full transition-all duration-800"
            style={{ width: `${homeData?.profile_completion || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Reciente */}
      <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 mb-6 lg:mb-8">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6">
          Reciente
        </h2>
        <div className="space-y-3 lg:space-y-4">
          {homeData?.recent_activity && homeData.recent_activity.length > 0 ? (
            homeData.recent_activity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 hover:bg-gray-100 rounded-lg">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-500 mb-1">{activity.date}</p>
                  <p className="text-sm lg:text-base text-gray-800 font-medium">{activity.message}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No hay actividad reciente</p>
            </div>
          )}
        </div>
      </div>

      {/* Sugerencias */}
      <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 mb-6 lg:mb-8">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6">
          Sugerencias
        </h2>
        <div className="space-y-1">
          {homeData?.suggestions && homeData.suggestions.length > 0 ? (
            homeData.suggestions.map((suggestion, index) => {
              const IconComponent = getSuggestionIcon(suggestion.type)
              return (
                <div key={index} className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                  </div>
                                     <p className="text-sm lg:text-base text-gray-800 font-medium">{suggestion.text}</p>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>¡Excelente! Tu perfil está completo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}