import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar acción", 
  message, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  type = "warning" // warning, danger, info
}) => {
  if (!isOpen) return null

  const getIconAndColors = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
          confirmButtonClass: "bg-red-500 hover:bg-red-600 text-white",
          borderClass: "border-red-200"
        }
      case 'info':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-blue-500" />,
          confirmButtonClass: "bg-blue-500 hover:bg-blue-600 text-white",
          borderClass: "border-blue-200"
        }
      default: // warning
        return {
          icon: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
          confirmButtonClass: "bg-yellow-500 hover:bg-yellow-600 text-white",
          borderClass: "border-yellow-200"
        }
    }
  }

  const { icon, confirmButtonClass, borderClass } = getIconAndColors()

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop que cubre toda la pantalla */}
      <div 
        className="absolute inset-0 backdrop-brightness-30 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal centrado */}
      <div className="relative h-full flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {icon}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
