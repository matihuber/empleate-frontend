import React from 'react'
import { Trash2, X } from 'lucide-react'

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName = "este elemento"
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop que cubre toda la pantalla */}
      <div 
        className="absolute inset-0 backdrop-brightness-30 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal centrado */}
      <div className="relative h-full flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Eliminar</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-600 text-sm">
            ¿Estás seguro de que quieres eliminar {itemName}?
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Eliminar
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
