import { useState, useEffect, useRef } from "react"
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Info } from "lucide-react"
import AuthLayout from "../../components/AuthLayout"
import LoginInput from "../../components/LoginInput"
import LoginButton from "../../components/LoginButton"
import { useAuth } from "../../contexts/AuthContext"

export default function Register() {
  const navigate = useNavigate()
  const { register, isLoading, error, clearError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPasswordInfo, setShowPasswordInfo] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const infoIconRef = useRef(null)

  // Limpiar errores cuando cambie el error del contexto
  useEffect(() => {
    if (error) {
      setErrors({ general: error })
    }
  }, [error])

  // Limpiar errores al desmontar
  useEffect(() => {
    return () => {
      clearError()
    }
  }, [clearError])

  // Función para calcular la posición del tooltip
  const calculateTooltipPosition = () => {
    if (infoIconRef.current) {
      const rect = infoIconRef.current.getBoundingClientRect()
      setTooltipPosition({
        top: rect.top + window.scrollY + 30, // Aún más abajo
        left: rect.left + window.scrollX - 226  // Mucho más a la izquierda
      })
    }
  }

  // Actualizar posición del tooltip cuando se muestre
  useEffect(() => {
    if (showPasswordInfo) {
      calculateTooltipPosition()
      // Recalcular en resize
      const handleResize = () => calculateTooltipPosition()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [showPasswordInfo])

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

  const handleStep2Submit = async (e) => {
    e.preventDefault()
    
    const newErrors = {}
    
    // Validaciones
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido"
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 12) {
      newErrors.password = "La contraseña debe tener al menos 12 caracteres"
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = "La contraseña debe contener al menos una letra minúscula"
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = "La contraseña debe contener al menos una letra mayúscula"
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = "La contraseña debe contener al menos un número"
    } else if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password)) {
      newErrors.password = "La contraseña debe contener al menos un símbolo"
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      // Limpiar errores previos
      setErrors({})
      
      // Preparar datos para el registro
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword
      }
      
      // Llamar al registro del AuthContext
      const response = await register(userData)
      
      // Si el registro es exitoso, redirigir al login
      if (response.success) {
        navigate('/login', { 
          state: { 
            message: 'Registro exitoso. Por favor, inicia sesión con tu nueva cuenta.' 
          } 
        })
      }
    } catch (error) {
      setErrors({ general: error.message })
    }
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

          {/* Error general */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-6">
              {errors.general}
            </div>
          )}

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
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                
                {/* Icono de información - posicionado absolutamente fuera del flujo */}
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 flex items-center">
                  <button
                    ref={infoIconRef}
                    type="button"
                    className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                    onMouseEnter={() => {
                      setShowPasswordInfo(true)
                      calculateTooltipPosition()
                    }}
                    onMouseLeave={() => setShowPasswordInfo(false)}
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  
                </div>
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
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
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
                <LoginButton type="submit" variant="primary" size="full" disabled={isLoading}>
                  {isLoading ? "Creando cuenta..." : "Crear cuenta"}
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
      
      {/* Portal del tooltip - se renderiza en el body */}
      {showPasswordInfo && createPortal(
        <div 
          className="fixed w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg pointer-events-none z-[99999]"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`
          }}
        >
          <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 rotate-45"></div>
          <p className="font-medium mb-2">Requisitos de contraseña:</p>
          <ul className="space-y-1">
            <li className={`flex items-center ${formData.password.length >= 12 ? 'text-green-400' : 'text-gray-300'}`}>
              <span className="mr-2">{formData.password.length >= 12 ? '✓' : '○'}</span>
              Al menos 12 caracteres
            </li>
            <li className={`flex items-center ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-400' : 'text-gray-300'}`}>
              <span className="mr-2">{/(?=.*[a-z])/.test(formData.password) ? '✓' : '○'}</span>
              Una letra minúscula
            </li>
            <li className={`flex items-center ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-400' : 'text-gray-300'}`}>
              <span className="mr-2">{/(?=.*[A-Z])/.test(formData.password) ? '✓' : '○'}</span>
              Una letra mayúscula
            </li>
            <li className={`flex items-center ${/(?=.*\d)/.test(formData.password) ? 'text-green-400' : 'text-gray-300'}`}>
              <span className="mr-2">{/(?=.*\d)/.test(formData.password) ? '✓' : '○'}</span>
              Un número
            </li>
            <li className={`flex items-center ${/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password) ? 'text-green-400' : 'text-gray-300'}`}>
              <span className="mr-2">{/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password) ? '✓' : '○'}</span>
              Un símbolo
            </li>
          </ul>
          <p className="text-gray-400 text-xs mt-2">
            Estos requisitos cumplen con los estándares de seguridad de Empleate.
          </p>
        </div>,
        document.body
      )}
    </AuthLayout>
  )
}