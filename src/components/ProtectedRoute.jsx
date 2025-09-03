import { Navigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../contexts/AuthContext'

export default function ProtectedRoute({ children, requireAuth = true }) {
  const authContext = useContext(AuthContext)
  const location = useLocation()

  // Verificar si el contexto está disponible
  if (!authContext) {
    console.error('ProtectedRoute: AuthContext no está disponible')
    return <Navigate to="/login" replace />
  }

  const { isAuthenticated, authState } = authContext

  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (requireAuth && !isAuthenticated) {
    // Redirigir al login y guardar la ubicación actual para volver después
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Si la ruta NO requiere autenticación y el usuario SÍ está autenticado
  if (!requireAuth && isAuthenticated) {
    // Redirigir al home si ya está logueado
    return <Navigate to="/" replace />
  }

  // Si está cargando, mostrar un loading
  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si todo está bien, renderizar los children
  return children
}
