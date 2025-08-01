import { useState } from "react"
import { Link } from 'react-router-dom';
import { Mail, Lock, Linkedin, Eye, EyeOff } from "lucide-react"
import { FaApple, FaMicrosoft, FaGoogle } from "react-icons/fa"
import LoginInput from "../../components/LoginInput"
import LoginButton from "../../components/LoginButton"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    // Aquí iría la lógica de validación y envío
    console.log("Form submitted:", formData)
  }

  const handleLinkedInLogin = () => {
    // Lógica para login con LinkedIn
    console.log("LinkedIn login")
  }

  const handleMoreOptions = () => {
    // Lógica para mostrar más opciones
    setShowMoreOptions(!showMoreOptions)
  }

  const handleAppleLogin = () => {
    console.log("Apple login")
  }

  const handleMicrosoftLogin = () => {
    console.log("Microsoft login")
  }

  const handleGoogleLogin = () => {
    console.log("Google login")
  }

  return (
    <div className="min-h-screen flex">
      {/* Lado Izquierdo - Fondo Azul */}
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
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 bg-gray-50">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Bienvenido</h1>
          </div>

          {/* Botones de login social */}
          <div className="space-y-4 mb-6">
            <LoginButton variant="linkedin" icon={Linkedin} onClick={handleLinkedInLogin}>
              Continuar con LinkedIn
            </LoginButton>

            {!showMoreOptions ? (
              <LoginButton variant="secondary" onClick={handleMoreOptions}>
                Ver otras opciones
              </LoginButton>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <LoginButton
                  variant="secondary"
                  icon={FaApple}
                  onClick={handleAppleLogin}
                  className="flex-1 justify-center"
                >
                </LoginButton>
                <LoginButton
                  variant="secondary"
                  icon={FaMicrosoft}
                  onClick={handleMicrosoftLogin}
                  className="flex-1 justify-center"
                >
                </LoginButton>
                <LoginButton
                  variant="secondary"
                  icon={FaGoogle}
                  onClick={handleGoogleLogin}
                  className="flex-1 justify-center"
                >
                </LoginButton>
              </div>
            )}
          </div>

          {/* Separador */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-gray-50 px-4">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <LoginInput
              type="email"
              name="email"
              placeholder="Email"
              icon={Mail}
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
            />

            <div className="relative">
              <LoginInput
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                icon={Lock}
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit button */}
            <LoginButton type="submit" variant="primary">
              Iniciar sesión
            </LoginButton>
          </form>

          {/* Register link */}
          <div className="text-center mt-8">
            <span className="text-gray-600">¿No tienes una cuenta? </span>
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
