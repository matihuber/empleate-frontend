import React from 'react'

export default function TemplatePreview({ template, isSelected }) {
  if (!template) return null

  const getTemplateStyle = () => {
    if (!template.theme_config) return {}
    
    const { colors, fonts } = template.theme_config
    
    return {
      backgroundColor: colors?.background || '#ffffff',
      color: colors?.text || '#1e293b',
      fontFamily: fonts?.body || 'Inter, sans-serif'
    }
  }

  const getHeaderStyle = () => {
    if (!template.theme_config) return {}
    
    const { colors } = template.theme_config
    
    return {
      backgroundColor: colors?.primary || '#2563eb',
      color: colors?.background || '#ffffff'
    }
  }

  const renderTemplateContent = () => {
    // Renderizar contenido del template basado en su configuración
    if (template.category === 'modern') {
      return (
        <div className="w-full h-full flex flex-col overflow-hidden" style={getTemplateStyle()}>
          {/* Header */}
          <div className="p-3 rounded-t-2xl" style={getHeaderStyle()}>
            <div className="text-center">
              <div className="text-base font-bold mb-1">NOMBRE APELLIDO</div>
              <div className="text-xs opacity-90">Desarrollador Full Stack</div>
              <div className="text-xs mt-1 opacity-75">email@ejemplo.com • +54 11 1234-5678</div>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-3 space-y-2">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-blue-600">RESUMEN</div>
              <div className="text-xs leading-relaxed">
                Desarrollador con experiencia en tecnologías modernas...
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs font-semibold text-blue-600">EXPERIENCIA</div>
              <div className="text-xs space-y-1">
                <div className="font-medium">Desarrollador Senior</div>
                <div className="opacity-75">Empresa • 2020-Presente</div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs font-semibold text-blue-600">HABILIDADES</div>
              <div className="text-xs">
                React, Node.js, Python, AWS...
              </div>
            </div>
          </div>
        </div>
      )
    }
    
    if (template.category === 'classic') {
      return (
        <div className="w-full h-full flex overflow-hidden" style={getTemplateStyle()}>
          {/* Sidebar */}
          <div className="w-1/3 p-2 bg-gray-50">
            <div className="text-center mb-3">
              <div className="text-sm font-bold text-gray-800">NOMBRE</div>
              <div className="text-xs text-gray-600">APELLIDO</div>
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">CONTACTO</div>
                <div className="text-xs text-gray-600">email@ejemplo.com</div>
                <div className="text-xs text-gray-600">+54 11 1234-5678</div>
              </div>
              
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">HABILIDADES</div>
                <div className="text-xs text-gray-600">• React</div>
                <div className="text-xs text-gray-600">• Node.js</div>
                <div className="text-xs text-gray-600">• Python</div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1 p-2">
            <div className="space-y-2">
              <div>
                <div className="text-xs font-bold text-gray-800 mb-1">EXPERIENCIA PROFESIONAL</div>
                <div className="text-xs">
                  <div className="font-medium">Desarrollador Senior</div>
                  <div className="text-gray-600">Empresa • 2020-Presente</div>
                </div>
              </div>
              
              <div>
                <div className="text-xs font-bold text-gray-800 mb-1">EDUCACIÓN</div>
                <div className="text-xs">
                  <div className="font-medium">Ingeniería en Sistemas</div>
                  <div className="text-gray-600">Universidad • 2015-2019</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    
    if (template.category === 'creative') {
      return (
        <div className="w-full h-full flex flex-col overflow-hidden" style={getTemplateStyle()}>
          {/* Hero section */}
          <div className="p-3 rounded-t-2xl bg-gradient-to-r from-purple-600 to-green-500 text-white">
            <div className="text-center">
              <div className="text-lg font-bold mb-1">NOMBRE APELLIDO</div>
              <div className="text-xs opacity-90">🚀 Desarrollador Full Stack</div>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <div className="text-xs font-semibold text-purple-800 mb-1">💻 HABILIDADES</div>
                <div className="text-xs text-purple-700">React, Node.js, Python</div>
              </div>
              
              <div className="bg-green-100 p-2 rounded-lg">
                <div className="text-xs font-semibold text-green-800 mb-1">🎯 EXPERIENCIA</div>
                <div className="text-xs text-green-700">5+ años</div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs font-semibold text-purple-600">📚 PROYECTOS</div>
              <div className="text-xs space-y-1">
                <div>• E-commerce Platform</div>
                <div>• API REST Services</div>
                <div>• Mobile App Development</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    
    // Default fallback
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 overflow-hidden">
        <div className="text-center">
          <div className="text-base font-bold mb-2">{template.name}</div>
          {template.description && (
            <div className="text-sm">{template.description}</div>
          )}
        </div>
      </div>
    )
  }

  // Solo renderizar el contenido interno, sin el contenedor de la card
  return renderTemplateContent()
}
