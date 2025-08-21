import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import LoginButton from '../../../components/LoginButton'
import CVTemplate1 from '../../../components/CVTemplate1' // Importar tu template

export default function CVCreation() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showTemplate, setShowTemplate] = useState(false)

  // Lista de templates disponibles (por ahora solo nombres)
  const templates = [
    { id: 1, name: 'Template 1' },
    { id: 2, name: 'Template 2' },
    { id: 3, name: 'Template 3' },
    { id: 4, name: 'Template 4' },
    { id: 5, name: 'Template 5' },
    { id: 6, name: 'Template 6' }
  ]

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId)
  }

  const handleContinue = () => {
    if (selectedTemplate) {
      console.log(`Template seleccionado: ${selectedTemplate}`)
      setShowTemplate(true) // Mostrar el template
    }
  }

  const handleBackToSelection = () => {
    setShowTemplate(false) // Volver a la selección
  }

  return (
    <div>
      {!showTemplate ? (
        // Vista de selección de templates
        <>
          {/* Título de la sección */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              Crea tu CV
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-600">
              Selecciona una plantilla
            </h2>
          </div>

          {/* Grid de templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {templates.map((template) => (
              <div key={template.id} className="flex flex-col items-center">
                {/* Contenedor vacío del template */}
                <div 
                  className={`w-full bg-white rounded-2xl shadow-lg border-2 transition-all cursor-pointer hover:shadow-xl ${
                    selectedTemplate === template.id 
                      ? 'border-blue-500' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                  style={{ aspectRatio: '0.7', minHeight: '300px' }}
                >
                  {/* Contenido vacío - aquí irán las previews después */}
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-lg">{template.name}</span>
                  </div>
                </div>

                {/* Checkbox circular de selección */}
                <div className="mt-4">
                  <input
                    type="radio"
                    name="template-selection"
                    id={`template-${template.id}`}
                    checked={selectedTemplate === template.id}
                    onChange={() => handleTemplateSelect(template.id)}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Botón continuar */}
          <div className="flex justify-end">
            <div className="w-48">
              <LoginButton
                onClick={handleContinue}
                disabled={!selectedTemplate}
                variant="primary"
                icon={ChevronRight}
              >
                Siguiente
              </LoginButton>
            </div>
          </div>
        </>
      ) : (
        // Vista del template seleccionado
        <>
          {/* Header con botón volver */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={handleBackToSelection}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Volver a plantillas</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Template {selectedTemplate}
              </h1>
              <p className="text-gray-600">Vista previa de tu CV</p>
            </div>

            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Editar CV
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Descargar PDF
              </button>
            </div>
          </div>

          {/* Template completo */}
          <div className="bg-gray-100 p-8 rounded-2xl">
            <CVTemplate1 />
          </div>
        </>
      )}
    </div>
  )
}