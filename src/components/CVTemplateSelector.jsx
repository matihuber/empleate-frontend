import React from 'react'
import { CV_TEMPLATES } from '../lib/templates'

// Función para determinar el mejor color de texto basándose en el color de fondo
const getContrastColor = (hexColor) => {
  // Convertir hex a RGB
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calcular luminancia
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Retornar blanco para fondos oscuros, negro para fondos claros
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

const CVTemplateSelector = ({ selectedTemplate, onTemplateSelect }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Elige tu Template</h2>
        <p className="text-gray-600">Selecciona un diseño que se adapte a tu estilo profesional</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {Object.values(CV_TEMPLATES).map((template) => (
          <div
            key={template.id}
            className={`relative cursor-pointer transition-all duration-200 ${
              selectedTemplate?.id === template.id
                ? 'scale-105'
                : 'hover:scale-105'
            }`}
            style={{
              border: selectedTemplate?.id === template.id ? '4px solid #2563eb' : 'none',
              borderRadius: '12px'
            }}
            data-selected={selectedTemplate === template.id}
            data-template-id={template.id}
            data-selected-template={selectedTemplate}
            onClick={() => {
              console.log('🔍 CVTemplateSelector: Click en template:', template)
              console.log('🔍 CVTemplateSelector: Template ID:', template.id)
              console.log('🔍 CVTemplateSelector: selectedTemplate actual:', selectedTemplate)
              onTemplateSelect(template.id)
            }}
          >
            {/* Template Preview */}
            <div className={`bg-white rounded-lg overflow-hidden transition-all duration-200 ${
              selectedTemplate?.id === template.id 
                ? 'shadow-blue-200' 
                : 'shadow-sm hover:shadow-md'
            }`}>
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
              
              {/* Mini CV Preview */}
              <div className="p-4">
                <div
                  className="w-full h-32 rounded border-2"
                  style={{
                    backgroundColor: template.colors.background,
                    borderColor: template.colors.secondary,
                  }}
                >
                  {/* Header Preview */}
                  <div
                    className="h-8 rounded-t flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: template.colors.primary,
                      color: getContrastColor(template.colors.primary),
                    }}
                  >
                    {template.name.toUpperCase()}
                  </div>
                  
                  {/* Content Preview */}
                  <div className="p-2 space-y-1">
                    <div
                      className="h-2 rounded"
                      style={{ backgroundColor: template.colors.primary }}
                    ></div>
                    <div
                      className="h-2 rounded w-3/4"
                      style={{ backgroundColor: template.colors.secondary }}
                    ></div>
                    <div
                      className="h-2 rounded w-1/2"
                      style={{ backgroundColor: template.colors.accent || template.colors.secondary }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedTemplate?.id === template.id && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Template Features */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Características de nuestros Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">ATS Compatible</h4>
              <p className="text-sm text-gray-600">Formato Harvard estándar que pasa los filtros automáticos</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Profesional</h4>
              <p className="text-sm text-gray-600">Diseños elegantes y apropiados para cualquier industria</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Personalizable</h4>
              <p className="text-sm text-gray-600">Edita colores, contenido y layout según tus preferencias</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CVTemplateSelector
