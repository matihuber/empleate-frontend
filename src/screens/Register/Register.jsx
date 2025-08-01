import { useState } from "react"
import { Link } from 'react-router-dom';
import { User } from "lucide-react"
import LoginInput from "../../components/LoginInput"
import LoginButton from "../../components/LoginButton"

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Validación básica
    const newErrors = {}
    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Aquí iría la lógica para continuar al siguiente paso
    console.log("Form submitted:", formData)
  }

  return (
    <div className="min-h-screen flex">
      {/* Lado Izquierdo - Fondo Azul (igual que Login) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        {/* Contenido principal */}
        <div className="flex flex-col justify-center items-center w-full px-12 text-center relative z-10">
          {/* Logo grande */}
          <div className="mb-12">
            <div className="flex items-center justify-center ">
              <img
                src="/images/logo-4x.png"
                alt="Empleate Logo"
                className="w-48 h-48 object-contain"
                onError={(e) => {
                  console.log("Error cargando logo grande:", e)
                  // Fallback al logo estilizado si falla la carga
                  e.target.style.display = "none"
                  e.target.nextElementSibling.style.display = "flex"
                }}
              />
              {/* Fallback logo estilizado (oculto por defecto) */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-300 to-blue-500 rounded-2xl items-center justify-center shadow-xl hidden">
                <span className="text-4xl font-bold text-white italic">e</span>
              </div>
            </div>
          </div>

          {/* Slogan */}
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-semibold text-slate-300 leading-tight">
                Impulsá tu carrera<br />
                con inteligencia artificial    
            </h1>
          </div>
        </div>
      </div>

      {/* Lado Derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col bg-gray-50 relative">
        {/* Contenido principal centrado */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800">Regístrate</h1>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <LoginInput
                type="text"
                name="firstName"
                placeholder="Nombre"
                icon={User}
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
              />

              <LoginInput
                type="text"
                name="lastName"
                placeholder="Apellido"
                icon={User}
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
              />

              {/* Submit button */}
              <div className="pt-4">
                <LoginButton type="submit" variant="primary">
                  Continuar
                </LoginButton>
              </div>
            </form>

            {/* Login link */}
            <div className="text-center mt-8">
            <span className="text-gray-600">¿Ya tienes una cuenta? </span>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Inicia sesión
            </Link>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
