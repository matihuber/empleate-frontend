import React from 'react'
import { X, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const PDFExportModal = ({ 
  isOpen, 
  onClose, 
  status, 
  message, 
  progress = 0 
}) => {
  if (!isOpen) return null

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-600" />
      default:
        return <Download className="w-8 h-8 text-blue-600" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'border-blue-200 bg-blue-50'
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  const getButtonColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white'
      case 'error':
        return 'bg-red-600 hover:bg-red-700 text-white'
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  }

  return (
    <div className="fixed inset-0 backdrop-brightness-75 backdrop-saturate-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 border-2 ${getStatusColor()}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">
            {status === 'loading' ? 'Exportando PDF' : 
             status === 'success' ? 'PDF Exportado' : 
             status === 'error' ? 'Error al Exportar' : 'Exportar PDF'}
          </h3>
          {status !== 'loading' && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>

          {/* Message */}
          <p className="text-gray-700 mb-6">
            {message || (
              status === 'loading' ? 'Generando tu CV en formato PDF...' :
              status === 'success' ? '¡Tu CV se ha exportado exitosamente!' :
              status === 'error' ? 'Hubo un problema al exportar tu CV.' :
              'Preparando la exportación...'
            )}
          </p>

          {/* Progress Bar (only for loading) */}
          {status === 'loading' && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {progress}% completado
              </p>
            </div>
          )}

          {/* Action Button */}
          {status !== 'loading' && (
            <button
              onClick={onClose}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${getButtonColor()}`}
            >
              {status === 'success' ? 'Continuar' : 
               status === 'error' ? 'Intentar de Nuevo' : 'Cerrar'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PDFExportModal
