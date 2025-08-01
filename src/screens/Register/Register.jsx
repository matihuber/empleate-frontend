import { useState } from "react"
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react"
import AuthLayout from "../../components/AuthLayout"
import LoginInput from "../../components/LoginInput"
import LoginButton from "../../components/LoginButton"

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const handleStep1Submit = (e) => {
    e.preventDefault()
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

    // Ir al paso 2
    setCurrentStep(2)
  }

  const handleStep2Submit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    }
    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Enviar datos completos
    console.log("Registro completo:", formData)
  }

  const goBackToStep1 = () => {
    setCurrentStep(1)
    setErrors({}) // Limpiar errores
    
    // Limpiar los campos del step 2
    setFormData((prev) => ({
      ...prev,
      email: "",
      password: "",
      confirmPassword: ""
    }))
  }

  return (
    <AuthLayout 
      showBackButton={currentStep === 2} 
      onBackClick={goBackToStep1}
    >
      {/* Solo el contenido del lado derecho */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800">Regístrate</h1>
          </div>

          {/* PASO 1: Nombre y Apellido */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-6">
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

              <div className="pt-4">
                <LoginButton type="submit" variant="primary" size="full">
                  Continuar
                </LoginButton>
              </div>
            </form>
          )}

          {/* PASO 2: Email y Contraseña */}
          {currentStep === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-6">
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

              <div className="relative">
                <LoginInput
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Repetir contraseña"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
              />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Términos y condiciones */}
              <p className="text-xs text-gray-500 text-center">
                Al registrarte, aceptas nuestros Términos y Condiciones y nuestra Política de Privacidad
              </p>

              <div className="pt-4">
                <LoginButton type="submit" variant="primary" size="full">
                  Crear cuenta
                </LoginButton>
              </div>
            </form>
          )}

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
    </AuthLayout>
  )
}