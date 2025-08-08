import { useState } from "react"
import { 
  Home, 
  User, 
  FileText, 
  History, 
  DollarSign, 
  BookOpen, 
  Settings,
  LogOut,
  Bell,
  Edit,
  Linkedin
} from "lucide-react"

export default function UserHome() {
  const [activeSection, setActiveSection] = useState('inicio')
  
  // Datos del usuario (esto vendría de una API o estado global)
  const user = {
    name: "Matías",
    profileCompletion: 70
  }

  // Datos de ejemplo para notificaciones
  const notifications = [
    {
      date: "18/05/2025",
      message: "Tu nuevo curriculum ha sido generado"
    }
  ]

  // Datos de ejemplo para sugerencias
  const suggestions = [
    {
      icon: Linkedin,
      text: "Añadí tu perfil de LinkedIn",
      type: "linkedin"
    },
    {
      icon: Edit,
      text: "Completá tu experiencia laboral",
      type: "experience"
    }
  ]

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
  }

  const handleLogout = () => {
    console.log("Cerrar sesión")
    // Aquí iría la lógica de logout
  }

  return (
    <div 
      className="w-screen h-screen p-4 md:p-6 lg:p-8"
      style={{
        background: `
          linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%),
          radial-gradient(circle at 20% 80%, #a5b4fc 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, #93c5fd 0%, transparent 50%)
        `,
      }}
    >
      {/* Card principal que contiene todo */}
      <div className="w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden flex">
        
        {/* Sidebar */}
        <div className="w-64 bg-white flex flex-col border-r border-gray-200 h-full">
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
        <div className="flex-1 flex flex-col bg-gray-50 relative h-full">
          {/* Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 pt-16 md:pt-20 overflow-y-auto">
            {activeSection === 'inicio' && (
              <div className="h-full">
                {/* Saludo */}
                <div className="mb-6 lg:mb-8 flex items-center justify-between">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
                    ¡Hola, {user.name}!
                  </h1>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-300 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-gray-600 font-medium text-sm md:text-base">M</span>
                  </div>
                </div>

                {/* Perfil Completo */}
                <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 mb-6 lg:mb-8">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-3 lg:mb-4">
                    Perfil completo al {user.profileCompletion}%
                  </h2>
                  <div className="w-full bg-gray-200 rounded-full h-2 lg:h-3">
                    <div 
                      className="bg-blue-600 h-2 lg:h-3 rounded-full transition-all duration-800"
                      style={{ width: `${user.profileCompletion}%` }}
                    ></div>
                  </div>
                </div>

                {/* Reciente */}
                <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 mb-6 lg:mb-8">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6">
                    Reciente
                  </h2>
                  <div className="space-y-3 lg:space-y-4">
                    {notifications.map((notification, index) => (
                      <div key={index} className="flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 hover:bg-gray-100 rounded-lg">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs lg:text-sm text-gray-500 mb-1">{notification.date}</p>
                          <p className="text-sm lg:text-base text-gray-800 font-medium">{notification.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sugerencias */}
                <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 mb-6 lg:mb-8">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6">
                    Sugerencias
                  </h2>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => {
                      const IconComponent = suggestion.icon
                      return (
                        <div key={index} className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                          </div>
                          <p className="text-sm lg:text-base text-gray-800 font-medium">{suggestion.text}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Otras secciones */}
            {activeSection !== 'inicio' && (
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