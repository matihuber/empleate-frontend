import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Linkedin, Eye, EyeOff } from "lucide-react"
import { FaApple, FaMicrosoft, FaGoogle } from "react-icons/fa"
import AuthLayout from "../../components/AuthLayout"
import LoginInput from "../../components/LoginInput"
import LoginButton from "../../components/LoginButton"

export default function Login() {
  const navigate = useNavigate()
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
    navigate('/user-home')
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
    </AuthLayout>
  )
}