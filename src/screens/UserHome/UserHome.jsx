import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Home, 
  User, 
  FileText, 
  History, 
  DollarSign, 
  BookOpen, 
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import AuthContext from "../../contexts/AuthContext"
import apiInterceptor from "../../services/apiInterceptor"
import Inicio from "./sections/Inicio"
import MisDatos from "./sections/MisDatos"
import CVCreation from "./sections/CVCreation"
import CVHistory from "./sections/CVHistory"
import SalaryEstimator from "../SalaryEstimator"

export default function UserHome() {
  const [activeSection, setActiveSection] = useState('inicio')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout, handleSessionExpired, clearSessionExpired, sessionExpired } = useContext(AuthContext)
  const navigate = useNavigate()
  
  // Configurar el interceptor de API para manejar expiración de sesión
  useEffect(() => {
    apiInterceptor.setNavigate(navigate)
    apiInterceptor.setOnSessionExpired(() => {
      console.log('UserHome: Sesión expirada, ejecutando logout')
      handleSessionExpired()
    })
  }, [navigate, handleSessionExpired])

  // Redirigir a la home principal si la sesión expiró
  useEffect(() => {
    if (sessionExpired) {
      console.log('UserHome: Redirigiendo a la home principal por sesión expirada')
      navigate('/')
      // Limpiar el estado de sesión expirada para evitar bucles
      clearSessionExpired()
    }
  }, [sessionExpired, navigate, clearSessionExpired])
  
  // Si no hay usuario, mostrar loading o redirigir
  if (!user) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }
  
  // Extraer nombre del usuario del contexto
  const firstName = user.name ? user.name.split(' ')[0] : user.email?.split('@')[0] || 'Usuario'
  const lastName = user.name ? user.name.split(' ').slice(1).join(' ') : ''
  const profileCompletion = 70 // Esto se puede calcular basado en datos del usuario

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'mis-datos', label: 'Mis Datos', icon: User },
    { id: 'crear-cv', label: 'Creá tu CV', icon: FileText },
    { id: 'historial-cvs', label: 'Historial de CVs', icon: History },
    { id: 'estimador-sueldo', label: 'Estimador de sueldo', icon: DollarSign },
    { id: 'recomendador-cursos', label: 'Recomendador de cursos', icon: BookOpen },
    { id: 'configuracion', label: 'Configuración', icon: Settings }
  ]

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId)
    // Cerrar sidebar en móviles después de hacer clic
    setSidebarOpen(false)
  }

  const handleLogout = () => {
    console.log("Cerrando sesión...")
    logout()
  }

  return (
    <div 
      className="w-screen h-screen p-2 sm:p-4 md:p-6 lg:p-8"
      style={{
        background: `
          linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%),
          radial-gradient(circle at 20% 80%, #a5b4fc 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, #93c5fd 0%, transparent 50%)
        `,
      }}
    >
      {/* Card principal que contiene todo */}
      <div className="w-full h-full bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden flex relative">
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 backdrop-brightness-70 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          bg-stone-50 flex flex-col border-r border-gray-200 h-full transition-transform duration-300 ease-in-out
          lg:w-64 lg:relative lg:translate-x-0
          ${sidebarOpen ? 'w-64 fixed left-0 top-0 z-50 translate-x-0' : 'w-64 fixed left-0 top-0 z-50 -translate-x-full'}
        `}>
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <img
                src="/images/logo.png"
                alt="Empleate Logo"
                className="w-8 h-8"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%232563eb'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ctext x='12' y='16' textAnchor='middle' fill='white' fontSize='12'%3Ee%3C/text%3E%3C/svg%3E"
                }}
              />
              <span className="text-xl font-semibold text-blue-600">Empleate</span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 py-4">
            <ul className="space-y-1 px-3">
              {menuItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                        activeSection === item.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mr-3" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">Cerrar sesión</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-stone-50 relative h-full lg:ml-0">
          {/* Content */}
          <main className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 overflow-y-scroll pt-16 lg:pt-4 bg-stone-50">
            {/* Renderizar secciones */}
            {activeSection === 'inicio' && <Inicio key="inicio" user={{
              firstName,
              lastName,
              profileCompletion,
              email: user.email,
              profileImage: null
            }} />}
            {activeSection === 'mis-datos' && <MisDatos key="mis-datos" user={{
              firstName,
              lastName,
              profileCompletion,
              email: user.email,
              profileImage: null,
              sub: user.sub  // Agregar el sub del usuario para autenticación
            }} />}
            {activeSection === 'crear-cv' && <CVCreation key="crear-cv" user={{
              firstName,
              lastName,
              profileCompletion,
              email: user.email,
              profileImage: null
            }} />}
            {activeSection === 'historial-cvs' && <CVHistory key="historial-cvs" user={{
              firstName,
              lastName,
              profileCompletion,
              email: user.email,
              profileImage: null,
              sub: user.sub  // Agregar el sub del usuario para autenticación
            }} onNavigateToSection={setActiveSection} />}
            {activeSection === 'estimador-sueldo' && <SalaryEstimator key="estimador-sueldo" />}

            {/* Otras secciones pendientes */}
            {!['inicio', 'mis-datos', 'crear-cv', 'historial-cvs', 'estimador-sueldo'].includes(activeSection) && (
              <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {menuItems.find(item => item.id === activeSection)?.label}
                </h2>
                <p className="text-gray-600">
                  Esta sección está en desarrollo...
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}