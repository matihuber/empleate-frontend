import React from 'react'

/**
 * EmpleateLoader - Loader basado en uiverse.io adaptado a los colores de Empleate
 * 
 * Características:
 * - Círculo giratorio con sombras internas azules (colores Empleate)
 * - Letras "Generating" que se animan con delays escalonados
 * - Sombras que cambian de color durante la rotación
 * - Tamaño: 180x180px (como el original)
 * 
 * @param {string} text - Texto principal del loader
 * 
 * @example
 * <EmpleateLoader text="Generando tu CV con IA..." />
 */
const EmpleateLoader = ({ text = 'Generando tu CV con IA...' }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Loader principal basado en uiverse.io */}
      <div className="loader-wrapper">
        <span className="loader-letter">G</span>
        <span className="loader-letter">e</span>
        <span className="loader-letter">n</span>
        <span className="loader-letter">e</span>
        <span className="loader-letter">r</span>
        <span className="loader-letter">a</span>
        <span className="loader-letter">n</span>
        <span className="loader-letter">d</span>
        <span className="loader-letter">o</span>

        <div className="loader"></div>
      </div>

      {/* Texto principal */}
      <p className="text-xl font-semibold text-gray-800 mb-2 mt-6">{text}</p>
      <p className="text-sm text-gray-500 mb-4">Esto puede tomar unos segundos</p>

      {/* Pasos del proceso */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Procesando perfil del usuario...</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <span>Generando contenido optimizado...</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
          <span>Aplicando template seleccionado...</span>
        </div>
      </div>
    </div>
  )
}

export default EmpleateLoader
