import React from 'react';
import { X } from 'lucide-react';

const DataRequiredModal = ({
  isOpen,
  onClose,
  title = "Datos Profesionales Requeridos",
  message = "Para generar un CV personalizado, necesitas subir un CV inicial o importar tu perfil de LinkedIn para que podamos analizar tu experiencia profesional. Dirígete a la sección 'Mis Datos' para subir tu información."
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-brightness-75 backdrop-saturate-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>

        <p className="text-sm text-gray-600 text-center">
          El análisis de tus datos profesionales es necesario para generar recomendaciones personalizadas
        </p>
      </div>
    </div>
  );
};

export default DataRequiredModal;