import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AlertCircle, LogIn } from 'lucide-react'

export default function SessionExpired() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const message = searchParams.get('message')

  useEffect(() => {
    // Si no hay mensaje de sesión expirada, redirigir al home
    if (message !== 'session_expired') {
      navigate('/')
    }
  }, [message, navigate])

  if (message !== 'session_expired') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Icono de alerta */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        
        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Sesión Expirada
        </h1>
        
        {/* Mensaje */}
        <p className="text-gray-600 mb-8">
          Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente para continuar.
        </p>
        
        {/* Botón de login */}
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          <LogIn className="w-5 h-5" />
          <span>Iniciar Sesión</span>
        </button>
        
        {/* Botón de volver al home */}
        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  )
}
