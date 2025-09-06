import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Linkedin, Eye, EyeOff } from "lucide-react"
import { FaApple, FaMicrosoft, FaGoogle } from "react-icons/fa"
import AuthLayout from "../../components/AuthLayout"
import LoginInput from "../../components/LoginInput"
import LoginButton from "../../components/LoginButton"
import { useAuth } from "../../contexts/AuthContext"

export default function Login() {
  
  const navigate = useNavigate()
  const location = useLocation()
  const { loginBasic, loginGoogle, loginLinkedIn, loginMicrosoft, isLoading, error, clearError, isAuthenticated, authState } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")

  // Limpiar errores cuando cambie el error del contexto
  useEffect(() => {
    if (error) {
      // Si es un error de credenciales incorrectas, mostrar en ambos campos
      if (error.includes('incorrectas') || error.includes('credenciales') || error.includes('401')) {
        const newErrors = { 
          general: error,
          email: "Credenciales incorrectas",
          password: "Credenciales incorrectas"
        }
        setErrors(newErrors)
      } else {
        const newErrors = { general: error }
        setErrors(newErrors)
      }
    }
    // NO limpiar errores automáticamente cuando error es null
    // Los errores se limpiarán cuando el usuario interactúe con los campos
  }, [error])

  // NO limpiar errores automáticamente - se limpiarán cuando el usuario interactúe

  // Redirigir cuando el usuario se autentique exitosamente
  useEffect(() => {
    if (isAuthenticated && authState === 'authenticated' && !error) {
      const from = location.state?.from?.pathname || '/user-home'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, authState, error, navigate, location.state])

  // Mostrar mensaje de éxito si viene del registro
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      // Limpiar el mensaje del estado de navegación
      navigate(location.pathname, { replace: true })
    }
  }, [location.state, navigate])

  // Mostrar mensaje de sesión expirada si viene de la URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const message = urlParams.get('message')
    
    if (message === 'session_expired') {
      setErrors({ 
        general: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente." 
      })
      // Limpiar el parámetro de la URL
      navigate(location.pathname, { replace: true })
    }
  }, [location.search, location.pathname, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Limpiar error del campo específico cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
    // También limpiar el error general si existe
    if (errors.general) {
      setErrors((prev) => ({
        ...prev,
        general: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validación básica
    const newErrors = {}
    if (!formData.email) newErrors.email = "El email es requerido"
    if (!formData.password) newErrors.password = "La contraseña es requerida"
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      // Limpiar errores previos
      setErrors({})
      
      // Llamar al login del AuthContext y esperar a que termine
      await loginBasic(formData.email, formData.password)
      
      // NO redirigir aquí - el useEffect se encargará de la redirección
      // cuando el estado cambie a autenticado
    } catch (error) {
      // No redirigir, solo mostrar el error
      setErrors({ general: error.message })
    }
  }

  const handleLinkedInLogin = async () => {
    try {
      setErrors({})
      await loginLinkedIn()
    } catch (error) {
      setErrors({ general: error.message })
    }
  }

  const handleMoreOptions = () => {
    // Lógica para mostrar más opciones
    setShowMoreOptions(!showMoreOptions)
  }

  const handleAppleLogin = () => {
    console.log("Apple login")
  }

  const handleMicrosoftLogin = async () => {
    try {
      setErrors({})
      await loginMicrosoft()
    } catch (error) {
      setErrors({ general: error.message })
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setErrors({})
      await loginGoogle()
    } catch (error) {
      setErrors({ general: error.message })
    }
  }

  return (
    <AuthLayout>
      {/* Solo el contenido del lado derecho */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20">
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

          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {successMessage}
            </div>
          )}

          {/* Error general */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
              {errors.general}
            </div>
          )}

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
              <Link 
                to="/password-recovery" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit button */}
            <LoginButton type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
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
    </AuthLayout>
  )
}