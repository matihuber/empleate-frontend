import { useState } from 'react'
import { ChevronRight, ChevronLeft, Plus, Trash2 } from 'lucide-react'
import LoginButton from '../../../components/LoginButton'
import CVTemplate1 from '../../../components/CVTemplate1' // Importar tu template

export default function CVCreation() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [currentStep, setCurrentStep] = useState('selection') // 'selection', 'personalization', 'skills', 'preview'

  // Estados para las habilidades técnicas
  const [skills, setSkills] = useState([])
  const [personalizationData, setPersonalizationData] = useState({
    rol: '',
    empresa: '',
    link: '',
    aspectos: '',
    nivel: 'Medio'
  })
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
      setCurrentStep('personalization') // Ir a personalización
    }
  }

  const handlePersonalizationContinue = () => {
    console.log('Datos de personalización:', personalizationData)
    setCurrentStep('skills') // Ir a habilidades
  }

  const handleSkillsContinue = () => {
    console.log('Habilidades:', skills)
    setCurrentStep('preview') // Ir a vista previa
  }

  // Función para combinar datos de personalización con datos del template
  const getCombinedCVData = () => {
    // Datos base del template (podrían venir de la API del usuario)
    const baseCVData = {
      personalInfo: {
        name: "ANA MARÍA FERNÁNDEZ",
        title: personalizationData.rol || "Java Programmer | Project Management | Business Tech",
        email: "ana@fernandez.com",
        phone: "+34 123 456 678",
        location: "León, México",
        linkedin: "linkedin.com",
        website: "anafernandez.com",
        avatar: null,
        age: "35 años"
      },
      summary: personalizationData.aspectos || "Apasionada desarrolladora de Java con más de 8 años de experiencia en desarrollo de aplicaciones y tecnologías web, con operación en funciones directas. Lider para la integración de sistemas y desarrollo de proyectos anteriores.",
      experience: [
        {
          position: "Java Developer Senior",
          company: personalizationData.empresa || "Everis",
          location: "Madrid, Spain",
          period: "01/2020 - Presente",
          achievements: [
            "Lidero un equipo de 5 desarrolladores en un proyecto público, logrando un ahorro del 20% en costos operativos.",
            "Implementé microservicios con tecnologías REST y SOAP, mejorando la eficiencia del sistema en un 15%.",
            "Desarrollé mejoras del Snail y SQL para automatización de procesos, aumentando la productividad individual y del equipo en un 25%.",
            "Colaboré con equipos internacionales en la integración de sistemas, alcanzando una compatibilidad del 95% con plataformas existentes.",
            "Optimicé queries de base de datos, reduciendo significativamente el tiempo de actividad del 98,9%."
          ]
        },
        {
          position: "Java Developer",
          company: "Everis",
          location: "Sevilla, Spain", 
          period: "06/2017 - 12/2019",
          achievements: [
            "Desarrollé componentes reutilizables en Struts, logrando una reducción del 40% en tiempos de desarrollo futuro.",
            "Implementé servicios web con XML mejorando la comunicación entre sistemas en un 30%.",
            "Colaboré en proyectos de migración de datos SQL a Oracle, mejorando la eficiencia y seguridad de los datos.",
            "Optimicé consultas en PL/SQL, reduciendo los tiempos de respuesta de aplicaciones críticas en un 30%."
          ]
        },
        {
          position: "Junior Java Developer",
          company: "DXC Technology",
          location: "México City, México",
          period: "02/2015 - 05/2017",
          achievements: [
            "Desarrollé funcionalidades en J2EE para aplicaciones de negocio, mejorando la experiencia del usuario.",
            "Asistí en la implementación de servicios web SOAP para clientes principales.",
            "Participé en la integración de sistemas en un centro de distribución, optimizando el tiempo de ejecución manual en un 30%."
          ]
        }
      ],
      education: [
        {
          degree: "Master en Informática",
          institution: "Universidad Politécnica de Madrid",
          location: "Madrid, Spain",
          period: "01/2013 - 01/2015"
        },
        {
          degree: "Grado en Ciencias de la Computación",
          institution: "Universidad de Guanajuato",
          location: "Guanajuato, México", 
          period: "01/2009 - 01/2013"
        }
      ],
      skills: {
        technical: [
          { name: "Java", level: 5 },
          { name: "J2EE", level: 5 },
          { name: "Struts", level: 4 },
          { name: "WebServices (SOAP/REST)", level: 4 },
          { name: "SQL/PL-SQL", level: 4 },
          { name: "Shell Scripting", level: 3 }
        ],
        languages: [
          { name: "Español", level: "Nativo" },
          { name: "Inglés", level: "Competente" }
        ]
      },
      achievements: [
        {
          title: "Líder en equipo de proyecto público",
          description: "Lideré con éxito un ahorro del 20% en costos operativos mediante la optimización de procesos."
        },
        {
          title: "Mejora en eficiencia del sistema",
          description: "Desarrollé servicios web microservicios logrando una mejora en la eficiencia del sistema de un 15% en más."
        },
        {
          title: "Automatización de procesos",
          description: "Desarrollé scripts que redujeron el tiempo manual de tareas, mejorando la productividad."
        },
        {
          title: "Capacitación para desarrolladores",
          description: "Generé nuevos miembros en tecnologías clave, aumentando la productividad en un 30% en promedio."
        }
      ],
      certifications: [
        {
          name: "Oracle Certified Professional Java SE",
          issuer: "Oracle",
          date: "2019"
        },
        {
          name: "AWS Cloud Practitioner",
          issuer: "Amazon Web Services",
          date: "2020"
        }
      ]
    }

    return baseCVData
  }

  const handleBackToSelection = () => {
    setCurrentStep('selection') // Volver a la selección
  }

  const handleBackToPersonalization = () => {
    setCurrentStep('personalization') // Volver a personalización
  }

  const handleBackToSkills = () => {
    setCurrentStep('skills') // Volver a habilidades
  }

  const handlePersonalizationChange = (field, value) => {
    setPersonalizationData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Funciones para manejar habilidades
  const handleSkillChange = (index, field, value) => {
    setSkills(prev => prev.map((skill, i) => 
      i === index ? { ...skill, [field]: value } : skill
    ))
  }

  const addSkill = () => {
    setSkills(prev => [...prev, { tool: '', level: 'Básico' }])
  }

  const removeSkill = (index) => {
    setSkills(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div>
      {currentStep === 'selection' && (
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
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
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
      )}

      {currentStep === 'skills' && (
        // Vista de habilidades técnicas
        <>
          {/* Título de la sección */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              Crea tu CV
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-600">
              Listá tu conocimiento
            </h2>
          </div>

          {/* Lista de habilidades */}
          <div className="max-w-3xl space-y-4">
            {skills.length === 0 ? (
              // Mensaje cuando no hay herramientas
              <div className="">
                <p className="text-gray-500 text-lg mb-6">
                  Aún no tienes herramientas agregadas
                </p>
              </div>
            ) : (
              // Mostrar herramientas cuando hay al menos una
              <>
                {/* Header de la tabla */}
                <div className="grid grid-cols-12 gap-4 items-center mb-4">
                  <div className="col-span-5">
                    <span className="text-base font-medium text-gray-700">Herramientas</span>
                  </div>
                  <div className="col-span-5">
                    <span className="text-base font-medium text-gray-700">Nivel</span>
                  </div>
                  <div className="col-span-2"></div>
                </div>

                {/* Lista de habilidades */}
                {skills.map((skill, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center">
                    {/* Campo herramienta */}
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder={"Escribe una herramienta"}
                        value={skill.tool}
                        onChange={(e) => handleSkillChange(index, 'tool', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
                      />
                    </div>

                    {/* Selector de nivel */}
                    <div className="col-span-5">
                      <select
                        value={skill.level}
                        onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
                      >
                        <option value="Básico">Básico</option>
                        <option value="Intermedio">Intermedio</option>
                        <option value="Avanzado">Avanzado</option>
                        <option value="Experto">Experto</option>
                      </select>
                    </div>

                    {/* Botón eliminar */}
                    <div className="col-span-2 flex justify-center">
                      <button
                        onClick={() => removeSkill(index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar herramienta"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Botón agregar herramienta */}
            <div className="pt-4">
              <button
                onClick={addSkill}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>Agregar herramienta</span>
              </button>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBackToPersonalization}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>

            <div className="w-48">
              <LoginButton
                onClick={handleSkillsContinue}
                variant="primary"
                icon={ChevronRight}
              >
                Siguiente
              </LoginButton>
            </div>
          </div>
        </>
      )}

      {currentStep === 'personalization' && (
        // Vista de personalización
        <>
          {/* Título de la sección */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              Crea tu CV
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-600">
              Personaliza tu CV según tu objetivo
            </h2>
          </div>

          {/* Formulario de personalización */}
          <div className="max-w-2xl space-y-6">
            {/* Rol deseado */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Rol deseado <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Desarrollador Backend"
                  value={personalizationData.rol}
                  onChange={(e) => handlePersonalizationChange('rol', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Empresa objetivo <span className="text-gray-500">(opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ingresá el nombre de la empresa"
                  value={personalizationData.empresa}
                  onChange={(e) => handlePersonalizationChange('empresa', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
                />
              </div>
            </div>

            {/* Link a la oferta laboral */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Link a la oferta laboral <span className="text-gray-500">(recomendado)</span>
              </label>
              <input
                type="url"
                placeholder="Pegá aquí el enlace"
                value={personalizationData.link}
                onChange={(e) => handlePersonalizationChange('link', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
              />
            </div>

            {/* Aspectos que querés destacar */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Aspectos que querés destacar <span className="text-gray-500">(opcional)</span>
              </label>
              <textarea
                placeholder="Escribí aquí tus prioridades e intereses"
                value={personalizationData.aspectos}
                onChange={(e) => handlePersonalizationChange('aspectos', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 resize-none"
              />
            </div>

            {/* Nivel de personalización */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-4">
                Nivel de personalización
              </label>
              <div className="flex items-center space-x-8">
                {['Básico', 'Medio', 'Avanzado'].map((nivel) => (
                  <div key={nivel} className="flex items-center">
                    <input
                      type="radio"
                      id={nivel}
                      name="nivel"
                      value={nivel}
                      checked={personalizationData.nivel === nivel}
                      onChange={(e) => handlePersonalizationChange('nivel', e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor={nivel} className="ml-2 text-sm font-medium text-gray-700">
                      {nivel}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBackToSelection}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>

            <div className="w-48">
              <LoginButton
                onClick={handlePersonalizationContinue}
                disabled={!personalizationData.rol}
                variant="primary"
                icon={ChevronRight}
              >
                Siguiente
              </LoginButton>
            </div>
          </div>
        </>
      )}

      {currentStep === 'preview' && (
        // Vista del template personalizado
        <>
          {/* Header con botón volver */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={handleBackToSkills}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Volver a habilidades</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Tu CV Personalizado
              </h1>
              <p className="text-gray-600">Vista previa final</p>
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
            <CVTemplate1 cvData={getCombinedCVData()} />
          </div>
        </>
      )}
    </div>
  )
}