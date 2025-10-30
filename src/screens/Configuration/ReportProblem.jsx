import { useState } from 'react'
import { ChevronLeft, X, Check } from 'lucide-react'
import configService from '../../services/configService'

const ReportProblem = ({ onBack }) => {
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      await configService.createSupportTicket(subject, description)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error creating support ticket:', error)
      setError(error.message || 'Error al enviar el reporte')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowSuccessModal(false)
    onBack() // Volver a configuración
  }

  // Verificar si el formulario es válido
  const isFormValid = subject.trim() !== '' && description.trim() !== ''

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
          Configuración
        </h1>
      </div>

      {/* Formulario */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Reportar un problema
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asunto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Asunto"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción"
              rows="8"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              !isFormValid || isLoading
                ? 'bg-blue-600 text-white cursor-not-allowed disabled:opacity-50'
                : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
            }`}
          >
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>

        {/* Botón volver */}
        <button
          onClick={onBack}
          className="mt-8 flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">Volver</span>
        </button>
      </div>

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Reporte enviado
              </h1>
              
              <p className="text-gray-600 font-medium mb-6">
                Recibimos tu mensaje y nuestro equipo ya está trabajando en una resolución. 
                <br />
                Te enviaremos una respuesta por email a la brevedad.
              </p>
              
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1.5">
                  <Check className="w-10 h-10 text-blue-600"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportProblem