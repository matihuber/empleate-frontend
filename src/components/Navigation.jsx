import { Link, useNavigate } from 'react-router-dom'
import { User, LogOut, FileText, Home } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useState, useRef, useEffect } from 'react'

export default function Navigation() {
  const { isAuthenticated, user, logout, isLoading } = useAuth()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setIsDropdownOpen(false)
    } catch (error) {
      console.error('Error en logout:', error)
    }
  }

  const handleGoToProfile = () => {
    navigate('/user-home')
    setIsDropdownOpen(false)
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
          <div className="relative" ref={dropdownRef}>
            {/* Botón del perfil */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.name ? user.name.split(' ')[0] : user?.email?.split('@')[0] || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                
                <button
                  onClick={handleGoToProfile}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Ir a mi perfil</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
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
