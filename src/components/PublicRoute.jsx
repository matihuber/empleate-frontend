import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PublicRoute({ children }) {
  const { isAuthenticated, authState } = useAuth()

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

  // Solo redirigir si definitivamente está autenticado y no hay errores
  // PERO no redirigir si estamos en el proceso de login
  if (isAuthenticated && authState === 'authenticated') {
    // Si el usuario está autenticado, redirigir a su home en lugar de la home pública
    return <Navigate to="/user-home" replace />
  }

  // Si no está autenticado o hay algún error, mostrar la ruta pública
  return children
}
