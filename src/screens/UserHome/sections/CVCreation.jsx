import { useState, useEffect } from 'react'
import { ChevronRight, ChevronLeft, } from 'lucide-react'
import LoginButton from '../../../components/LoginButton'
import CVTemplate1 from '../../../components/CVTemplate1'
import TemplatePreview from '../../../components/TemplatePreview'
import apiInterceptor from '../../../services/apiInterceptor'
import templateService from '../../../services/templateService'
import cvPrepService from '../../../services/cvPrepService'
import cvGenerationService from '../../../services/cvGenerationService'
import CVCanvasEditor from '../../../components/CVCanvasEditor'
import CVTemplateSelector from '../../../components/CVTemplateSelector'


export default function CVCreation() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [templates, setTemplates] = useState([])
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [currentStep, setCurrentStep] = useState('selection') // 'selection', 'personalization', 'skills', 'generating', 'editor'
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCV, setGeneratedCV] = useState(null)
  const [error, setError] = useState(null)

  // Estados para las habilidades técnicas
  const [skills, setSkills] = useState([])
  const [personalizationData, setPersonalizationData] = useState({
    rol: '',
    empresa: '',
    link: '',
    aspectos: '',
    nivel: 'Medio'
  })
  const [linkError, setLinkError] = useState('')

  // TEMPORAL: Función de validación de LinkedIn comentada
  // const validateLinkedInUrl = (url) => {
  //   if (!url) {
  //     setLinkError('')
  //     return true
  //   }
  //   
  //   try {
  //     const urlObj = new URL(url)
  //     const domain = urlObj.hostname.toLowerCase()
  //     
  //     if (domain.includes('linkedin.com')) {
  //       setLinkError('')
  //       return true
  //     } else {
  //       setLinkError('Debe ser una URL de LinkedIn')
  //       return false
  //     }
  //   } catch (error) {
  //     setLinkError('URL inválida')
  //     return false
  //   }
  // }

  // Mapeo de templates del backend a IDs locales
  const mapBackendToLocalTemplate = (backendTemplate) => {
    // Mapear por nombre o descripción
    const name = backendTemplate.name?.toLowerCase() || ''
    const description = backendTemplate.description?.toLowerCase() || ''
    
    if (name.includes('modern') || description.includes('modern') || description.includes('tech')) {
      return { ...backendTemplate, localId: 'moderno' }
    } else if (name.includes('clas') || description.includes('harvard') || description.includes('tradicional')) {
      return { ...backendTemplate, localId: 'clasico' }
    } else if (name.includes('minimal') || description.includes('simple') || description.includes('elegante')) {
      return { ...backendTemplate, localId: 'minimalista' }
    } else if (name.includes('ejecut') || description.includes('profesional') || description.includes('sofisticado')) {
      return { ...backendTemplate, localId: 'ejecutivo' }
    } else if (name.includes('creat') || description.includes('innovador') || description.includes('dinamico')) {
      return { ...backendTemplate, localId: 'creativo' }
    } else if (name.includes('academ') || description.includes('serio') || description.includes('investigativo')) {
      return { ...backendTemplate, localId: 'academico' }
    } else {
      // Default al moderno si no coincide
      return { ...backendTemplate, localId: 'moderno' }
    }
  }

  // Cargar templates al montar el componente
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoadingTemplates(true)
        const templatesData = await templateService.getTemplates()
        // Mapear cada template del backend a un ID local
        const mappedTemplates = templatesData.map(mapBackendToLocalTemplate)
        setTemplates(mappedTemplates)
        console.log('Templates cargados y mapeados:', mappedTemplates)
      } catch (error) {
        console.error('Error cargando templates:', error)
        // En caso de error, usar templates por defecto
        setTemplates([
          { id: 'default-1', name: 'Template 1', description: 'Template por defecto', localId: 'moderno' },
          { id: 'default-2', name: 'Template 2', description: 'Template por defecto', localId: 'clasico' },
          { id: 'default-3', name: 'Template 3', description: 'Template por defecto', localId: 'minimalista' }
        ])
      } finally {
        setLoadingTemplates(false)
      }
    }

    loadTemplates()
  }, [])



  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
  }

  const handleContinue = async () => {
    if (!selectedTemplate) {
      alert('Por favor selecciona un template')
      return
    }

    try {
      console.log('🔍 CVCreation: Template seleccionado:', selectedTemplate)
      
      // NO llamar al backend - usar solo templates locales
      console.log('✅ CVCreation: Template seleccionado localmente')
      
      setCurrentStep('personalization')
    } catch (error) {
      console.error('❌ CVCreation: Error:', error)
      alert('Error: ' + error.message)
    }
  }

  const handlePersonalizationContinue = async () => {
    try {
      console.log('🔍 CVCreation: Datos de personalización:', personalizationData)
      
      // TEMPORAL: Validación de LinkedIn comentada
      // if (personalizationData.link && !validateLinkedInUrl(personalizationData.link)) {
      //   console.log('❌ CVCreation: URL no es de LinkedIn')
      //   return // No continuar si la URL no es válida
      // }
      
      // NO llamar al backend - guardar solo localmente
      console.log('✅ CVCreation: Datos de personalización guardados localmente')
      
      setCurrentStep('skills')
    } catch (error) {
      console.error('❌ CVCreation: Error:', error)
      alert('Error: ' + error.message)
    }
  }

  const handleSkillsContinue = async () => {
    try {
      // Generar CV automáticamente
      await generateCV()
    } catch (error) {
      console.error('❌ CVCreation: Error generando CV:', error)
      setError(error.message)
    }
  }

  const generateCV = async () => {
    try {
      setIsGenerating(true)
      setError(null)
      setCurrentStep('generating')
      
      // Primero guardar los datos de prefill (incluye web scraping si hay URL)
      const prefillData = {
        ...personalizationData,
        skills: skills
      }
      await cvPrepService.savePrefill(prefillData)
      
      // Preparar datos para generación
      const generationData = {
        template_id: selectedTemplate.id,
        target_role: personalizationData.rol,
        target_company: personalizationData.empresa || null,
        job_posting_url: personalizationData.link || null,
        language: 'es', // Por defecto español
        tone: 'modern', // Usar valor válido del enum
        personalization_level: personalizationData.nivel.toLowerCase()
      }
      
      // Llamar al servicio de generación
      const result = await cvGenerationService.generateCV(generationData)
      
      setGeneratedCV(result)
      setCurrentStep('editor')
      
    } catch (error) {
      console.error('❌ CVCreation: Error generando CV:', error)
      setError(error.message)
      setCurrentStep('skills') // Volver al paso anterior
    } finally {
      setIsGenerating(false)
    }
  }

  // Función para transformar datos del backend al formato del frontend
  const transformBackendCVData = (backendData) => {
    console.log('🔍 CVCreation: Transformando datos del backend:', backendData)
    console.log('🔍 CVCreation: Estructura del backend:', {
      header: backendData.header,
      summary: backendData.summary,
      experience: backendData.experience,
      education: backendData.education,
      skills: backendData.skills,
      languages: backendData.languages
    })
    
    // Transformar skills manteniendo el nivel de conocimiento
    const transformedSkills = backendData.skills?.hard?.map(skill => {
      if (typeof skill === 'object') {
        return {
          name: skill.name || skill,
          level: skill.level || 'intermedio'
        }
      }
      return {
        name: skill,
        level: 'intermedio'
      }
    }) || []
    
    // Función para mapear niveles antiguos a CEFR
    const mapLanguageLevel = (oldLevel) => {
      const levelMap = {
        'basico': 'A1',
        'intermedio': 'B1', 
        'avanzado': 'C1',
        'nativo': 'nativo',
        'C2': 'C2', // Ya está en formato CEFR
        'B2': 'B2', // Ya está en formato CEFR
        'A1': 'A1', // Ya está en formato CEFR
        'A2': 'A2', // Ya está en formato CEFR
        'B1': 'B1', // Ya está en formato CEFR
        'C1': 'C1'  // Ya está en formato CEFR
      }
      return levelMap[oldLevel] || 'B1' // Default a B1 si no se encuentra
    }

    // Transformar languages mapeando niveles a CEFR
    const transformedLanguages = backendData.languages?.map(lang => {
      if (typeof lang === 'object') {
        return {
          name: lang.name || lang,
          level: mapLanguageLevel(lang.level) || 'B1'
        }
      }
      return {
        name: lang,
        level: 'B1'
      }
    }) || []
    
    // Transformar experience
    const transformedExperience = backendData.experience?.map((exp, index) => ({
      id: `exp-${index}`,
      company: exp.company || 'Empresa',
      position: exp.role || 'Cargo',
      startDate: exp.start_date || '2020',
      endDate: exp.end_date || 'Presente', // Cambiar de '2023' a 'Presente'
      current: exp.end_date === 'present' || exp.end_date === null || !exp.end_date,
      description: exp.description || 'Descripción del cargo...',
    })) || []
    
    // Transformar education
    const transformedEducation = backendData.education?.map((edu, index) => ({
      id: `edu-${index}`,
      institution: edu.institution || 'Institución',
      degree: edu.degree || 'Título',
      year: edu.end_date || '2023',
    })) || []
    
    const transformedData = {
      id: 'cv-1',
      name: 'Mi CV Personalizado',
      template: 'moderno',
      personalInfo: {
        fullName: backendData.header?.full_name || 'Tu Nombre',
        email: backendData.header?.email || 'email@ejemplo.com',
        phone: backendData.header?.phone || 'Teléfono',
        location: backendData.header?.location || 'Ubicación',
        title: backendData.header?.title || 'Título Profesional',
      },
      summary: backendData.summary?.long || backendData.summary?.short || 'Resumen profesional...',
      experience: transformedExperience,
      education: transformedEducation,
      skills: transformedSkills,
      languages: transformedLanguages,
      certifications: backendData.certifications?.map((cert, index) => ({
        id: `cert-${index}`,
        name: typeof cert === 'object' ? cert.name : cert,
        issuer: typeof cert === 'object' ? cert.issuer : '',
        date: typeof cert === 'object' ? cert.date : ''
      })) || [],
      projects: backendData.projects || [],
    }
    
    console.log('✅ CVCreation: Datos transformados:', transformedData)
    return transformedData
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
          title: "Java Developer Senior",
          company: "Meta",
          period: "01/2020 - Presente",
          location: "Madrid, Spain",
          description: "Lidero un equipo de 5 desarrolladores en un proyecto público, logrando un ahorro del 20% en costos operativos. Implementé microservicios con tecnologías REST y SOAP, mejorando la eficiencia del sistema en un 15%."
        },
        {
          title: "Full Stack Developer",
          company: "Google",
          period: "03/2018 - 12/2019",
          location: "Barcelona, Spain",
          description: "Desarrollé aplicaciones web responsivas usando React, Node.js y MongoDB. Colaboré en la implementación de CI/CD pipelines que redujeron el tiempo de deployment en un 40%."
        }
      ],
      skills: skills.length > 0 ? skills.map(skill => skill.name || skill) : [
        "Java",
        "Spring Boot", 
        "React",
        "Node.js",
        "PostgreSQL",
        "Docker"
      ],
      education: [
        {
          degree: "Ingeniería en Sistemas",
          institution: "Universidad de León",
          period: "2015 - 2019"
        },
        {
          degree: "Certificación AWS Developer",
          institution: "Amazon Web Services",
          period: "2020"
        }
      ],
      certifications: [
        "Oracle Certified Professional Java Programmer",
        "Scrum Master Certified (SMC)",
        "AWS Solutions Architect Associate"
      ],
      languages: [
        "Español",
        "Inglés", 
        "Francés"
      ]
    }
    
    return baseCVData
  }

  // Renderizar el paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'selection':
        return (
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

            {/* Nuevo Selector de Templates */}
            <CVTemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={(templateId) => {
                console.log('🔍 CVCreation: onTemplateSelect llamado con:', templateId)
                // Usar directamente el template local
                handleTemplateSelect({ id: templateId })
              }}
            />

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
        )

      case 'personalization':
        return (
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
            <div className="space-y-6">
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
                    onChange={(e) => setPersonalizationData(prev => ({ ...prev, rol: e.target.value }))}
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
                    onChange={(e) => setPersonalizationData(prev => ({ ...prev, empresa: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
                  />
                </div>
              </div>

              {/* TEMPORAL: Link a la oferta laboral comentado */}
              {/* <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Link a la oferta laboral de LinkedIn <span className="text-gray-500">(recomendado)</span>
                </label>
                <input
                  type="url"
                  placeholder="Pegá aquí el enlace de LinkedIn"
                  value={personalizationData.link}
                  onChange={(e) => {
                    setPersonalizationData(prev => ({ ...prev, link: e.target.value }))
                    validateLinkedInUrl(e.target.value)
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 ${
                    linkError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {linkError && (
                  <p className="mt-2 text-sm text-red-600">{linkError}</p>
                )}
              </div> */}

              {/* Aspectos que querés destacar */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Aspectos que querés destacar <span className="text-gray-500">(opcional)</span>
                </label>
                <textarea
                  placeholder="Escribí aquí tus prioridades e intereses"
                  value={personalizationData.aspectos}
                  onChange={(e) => setPersonalizationData(prev => ({ ...prev, aspectos: e.target.value }))}
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
                        onChange={(e) => setPersonalizationData(prev => ({ ...prev, nivel: e.target.value }))}
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
                onClick={() => setCurrentStep('selection')}
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
        )

      case 'skills':
        return (
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
            <div className="space-y-4">
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
                          onChange={(e) => {
                            const newSkills = [...skills]
                            newSkills[index].tool = e.target.value
                            setSkills(newSkills)
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
                        />
                      </div>

                      {/* Selector de nivel */}
                      <div className="col-span-5">
                        <select
                          value={skill.level}
                          onChange={(e) => {
                            const newSkills = [...skills]
                            newSkills[index].level = e.target.value
                            setSkills(newSkills)
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
                        >
                          <option value="Básico">Básico</option>
                          <option value="Intermedio">Intermedio</option>
                          <option value="Avanzado">Avanzado</option>
                          <option value="Experto">Experto</option>
                        </select>
                      </div>

                      {/* Botón eliminar */}
                      <div className="col-span-2 flex justify-start">
                        <button
                          onClick={() => setSkills(skills.filter((_, i) => i !== index))}
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
                  onClick={() => setSkills([...skills, { tool: '', level: 'Básico' }])}
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
                onClick={() => setCurrentStep('personalization')}
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
        )

      case 'generating':
        return (
          <div className="text-center space-y-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="text-2xl font-bold text-gray-900">Generando tu CV</h2>
            <p className="text-gray-600">Estamos procesando tu información con IA para crear un CV optimizado...</p>
            <div className="text-sm text-gray-500">
              <p>• Analizando tu perfil profesional</p>
              <p>• Optimizando contenido para ATS</p>
              <p>• Aplicando formato Harvard</p>
            </div>
          </div>
        )

      case 'editor':
        return (
          <div className="h-full">
            {generatedCV ? (
              <CVCanvasEditor
                cvData={transformBackendCVData(generatedCV.content_json)}
                template={selectedTemplate}
                onSave={handleSaveCV}
                onExport={handleExportCV}
                onBack={() => setCurrentStep('skills')}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay CV generado para editar</p>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Paso no reconocido</p>
          </div>
        )
    }
  }

  // Manejadores para el editor
  const handleSaveCV = async (cvData) => {
    try {
      console.log('🔍 CVCreation: Guardando CV...')
      console.log('🔍 CVCreation: cvData:', cvData)
      console.log('🔍 CVCreation: selectedTemplate:', selectedTemplate)
      console.log('🔍 CVCreation: selectedTemplate.id:', selectedTemplate?.id)
      
      // Usar el nombre del CV que ya está en el editor
      const cvName = cvData.name || 'Mi CV Personalizado'
      console.log('🔍 CVCreation: Nombre del CV:', cvName)
      
      // Importar servicio dinámicamente
      const { cvStorageService } = await import('../../../services/cvStorageService')
      console.log('🔍 CVCreation: Servicio importado correctamente')
      
      // Guardar en el backend
      console.log('🔍 CVCreation: Llamando a cvStorageService.saveCV...')
      await cvStorageService.saveCV(cvData, cvName, selectedTemplate?.id || 'moderno')
      console.log('✅ CVCreation: CV guardado exitosamente en backend')
      
      // Mostrar notificación más elegante
      const notification = document.createElement('div')
      notification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10000;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
        ">
          ✅ CV "${cvName}" guardado exitosamente
        </div>
      `
      document.body.appendChild(notification)
      
      // Remover la notificación después de 3 segundos
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 3000)
      
    } catch (error) {
      console.error('❌ CVCreation: Error guardando CV:', error)
      console.error('❌ CVCreation: Stack trace:', error.stack)
      
      // Mostrar error más elegante
      const errorNotification = document.createElement('div')
      errorNotification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #ef4444;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10000;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
        ">
          ❌ Error guardando CV: ${error.message}
        </div>
      `
      document.body.appendChild(errorNotification)
      
      // Remover la notificación después de 5 segundos
      setTimeout(() => {
        if (errorNotification.parentNode) {
          errorNotification.parentNode.removeChild(errorNotification)
        }
      }, 5000)
    }
  }

  const handleExportCV = async (cvData, onProgress = null) => {
    try {
      console.log('🔍 CVCreation: Exportando CV...')
      
      // Usar el nombre del CV que ya está en el editor
      const fileName = cvData.name || 'Mi CV'
      console.log('🔍 CVCreation: Nombre del archivo:', fileName)
      
      // Importar servicio dinámicamente
      const { pdfExportService } = await import('../../../services/pdfExportService')
      
      try {
        // Intentar exportar usando el backend
        await pdfExportService.exportToPDF(cvData, fileName, selectedTemplate.id, onProgress)
        
        // Mostrar notificación de éxito
        const notification = document.createElement('div')
        notification.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 14px;
            font-weight: 500;
          ">
            ✅ PDF "${fileName}.pdf" descargado exitosamente
          </div>
        `
        document.body.appendChild(notification)
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification)
          }
        }, 3000)
        
      } catch (backendError) {
        console.log('⚠️ Backend no disponible, usando fallback...')
        // Fallback: usar html2canvas + jsPDF
        await pdfExportService.exportToPDFFallback(cvData, fileName)
        
        // Mostrar notificación de éxito con fallback
        const notification = document.createElement('div')
        notification.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 14px;
            font-weight: 500;
          ">
            ✅ PDF "${fileName}.pdf" descargado exitosamente (modo local)
          </div>
        `
        document.body.appendChild(notification)
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification)
          }
        }, 3000)
      }
      
    } catch (error) {
      console.error('❌ CVCreation: Error exportando CV:', error)
      
      // Mostrar error más elegante
      const errorNotification = document.createElement('div')
      errorNotification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #ef4444;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10000;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
        ">
          ❌ Error exportando CV: ${error.message}
        </div>
      `
      document.body.appendChild(errorNotification)
      
      setTimeout(() => {
        if (errorNotification.parentNode) {
          errorNotification.parentNode.removeChild(errorNotification)
        }
      }, 5000)
    }
  }

  return (
    <div>
      {renderCurrentStep()}
    </div>
  )
}