import { useState, useEffect } from "react"
import { Mail } from "lucide-react"
import { Link } from "react-router-dom"
import AuthLayout from "../../components/AuthLayout"
import LoginInput from "../../components/LoginInput"
import LoginButton from "../../components/LoginButton"
import { useAuth } from "../../contexts/AuthContext"

export default function PasswordRecovery() {
  const { requestPasswordReset, isLoading, error: authError, clearError } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Limpiar errores cuando cambie el error del contexto
  useEffect(() => {
    if (authError) {
      setError(authError)
    }
  }, [authError])

  // Limpiar errores al desmontar
  useEffect(() => {
    return () => {
      clearError()
    }
  }, [clearError])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError("El email es requerido")
      return
    }

    try {
      // Limpiar errores previos
      setError("")
      
      // Llamar al servicio de reset de contraseña
      await requestPasswordReset(email)
      
      // Si es exitoso, mostrar mensaje de confirmación
      setIsSubmitted(true)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (error) setError("")
  }

  return (
    <AuthLayout>
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              ¿Olvidaste tu contraseña?
            </h1>
            {!isSubmitted && (
            <p className="text-gray-600 text-sm">
              Por favor, introduce tu email para restablecer tu contraseña
            </p>
            )}
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <LoginInput
                type="email"
                name="email"
                placeholder="Email"
                icon={Mail}
                value={email}
                onChange={handleEmailChange}
                error={error}
              />

              <LoginButton type="submit" variant="primary" size="full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar"}
              </LoginButton>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                ¡Email enviado!
              </h2>
              <p className="text-gray-600 text-sm">
                Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
              </p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}