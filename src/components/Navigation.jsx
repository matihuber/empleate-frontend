import { Link } from 'react-router-dom'
import { User, LogOut, FileText, Home } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Navigation() {
  const { isAuthenticated, user, logout, isLoading } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error en logout:', error)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo y nombre */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <img
            src="/images/logo.png"
            alt="Empleate Logo"
            className="w-6 h-6"
            onError={(e) => {
              console.log("Error cargando logo:", e)
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%232563eb'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ctext x='12' y='16' textAnchor='middle' fill='white' fontSize='12'%3Ee%3C/text%3E%3C/svg%3E"
            }}
          />
          <span className="text-xl font-semibold text-blue-600">Empleate</span>
        </Link>

        {/* Navegación del usuario autenticado */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            {/* Menú de navegación */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Inicio</span>
              </Link>
              <Link 
                to="/my-data" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Mis Datos</span>
              </Link>
              <Link 
                to="/cv-prep" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>CV</span>
              </Link>
            </nav>

            {/* Usuario y logout */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <span>Hola,</span>
                <span className="font-medium text-gray-800">
                  {user?.name ? user.name.split(' ')[0] : user?.email?.split('@')[0] || 'Usuario'}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Cerrar sesión</span>
              </button>
            </div>
          </div>
        ) : (
          /* Botón de login para usuarios no autenticados */
          <Link 
            to="/login" 
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors duration-200"
          >
            <User className="w-5 h-5 text-gray-600" />
            <span className="hidden md:inline text-gray-600">Iniciar sesión</span>
          </Link>
        )}
      </div>
    </header>
  )
}
