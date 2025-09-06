import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PublicRoute({ children }) {
  const { isAuthenticated, authState, error, isLoading } = useAuth()

  // Solo redirigir si definitivamente está autenticado, no hay errores, no estamos en estado de error, y no está cargando
  if (isAuthenticated && authState === 'authenticated' && !error && !isLoading) {
    // Si el usuario está autenticado, redirigir a su home en lugar de la home pública
    return <Navigate to="/user-home" replace />
  }

  // Si no está autenticado, hay algún error, estamos en estado de error, o está cargando, mostrar la ruta pública
  // Dejamos que cada componente maneje su propio loading para mantener el fondo correcto
  return children
}
