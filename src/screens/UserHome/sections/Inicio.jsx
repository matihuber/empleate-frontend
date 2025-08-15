import { Bell, Edit, Linkedin } from "lucide-react"

export default function Inicio({ user }) {
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

  return (
    <div>
      {/* Saludo con Avatar - Solo en sección Inicio */}
      <div className="mb-6 lg:mb-8 flex justify-between">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
          ¡Hola, {user.firstName}!
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
  )
}