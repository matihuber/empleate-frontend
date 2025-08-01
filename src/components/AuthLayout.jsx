import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function AuthLayout({ 
  children, 
  showBackButton = false, 
  backTo = "/login",
  onBackClick 
}) {
  return (
    <div className="min-h-screen flex">
      {/* Lado Izquierdo - Siempre igual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        <div className="flex flex-col justify-center items-center w-full px-12 text-center relative z-10">
          <div className="mb-12">
            <div className="flex items-center justify-center">
              <img
                src="/images/logo-4x.png"
                alt="Empleate Logo"
                className="w-48 h-48 object-contain"
                onError={(e) => {
                  console.log("Error cargando logo grande:", e)
                  e.target.style.display = "none"
                  e.target.nextElementSibling.style.display = "flex"
                }}
              />
              <div className="w-24 h-24 bg-gradient-to-br from-blue-300 to-blue-500 rounded-2xl items-center justify-center shadow-xl hidden">
                <span className="text-4xl font-bold text-white italic">e</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-semibold text-slate-300 leading-tight">
              Impulsá tu carrera<br />
              con inteligencia artificial    
            </h1>
          </div>
        </div>
      </div>

      {/* Lado Derecho - Contenido dinámico */}
      <div className="w-full lg:w-1/2 flex flex-col bg-gray-50 relative">
        {/* Botón de regreso si es necesario */}
        {showBackButton && (
          <div className="absolute top-8 left-8 z-10">
            {onBackClick ? (
              <button
                onClick={onBackClick}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            ) : (
              <Link
                to={backTo}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors inline-block"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
            )}
          </div>
        )}
        
        {/* Contenido específico de cada pantalla */}
        {children}
      </div>
    </div>
  )
}