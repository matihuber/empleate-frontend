import { useState, useEffect } from 'react'
import { ChevronRight, ChevronLeft, } from 'lucide-react'
import LoginButton from '../../../components/LoginButton'
import CVTemplate1 from '../../../components/CVTemplate1' // Importar tu template
import TemplatePreview from '../../../components/TemplatePreview'
import CVCanvasEditor from '../../../components/CVCanvasEditor'
import apiInterceptor from '../../../services/apiInterceptor'
import templateService from '../../../services/templateService'
import cvPrepService from '../../../services/cvPrepService'
import cvGenerationService from '../../../services/cvGenerationService'
import { SessionExpired, EmpleateLoader } from '../../../components'

export default function CVCreation() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [templates, setTemplates] = useState([])
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [currentStep, setCurrentStep] = useState('selection') // 'selection', 'personalization', 'skills', 'preview'
  const [sessionExpired, setSessionExpired] = useState(false)
  const [generatedCV, setGeneratedCV] = useState(null)
  const [isGeneratingCV, setIsGeneratingCV] = useState(false)
  const [generationError, setGenerationError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [cvName, setCvName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  // Estados para las habilidades técnicas
  const [skills, setSkills] = useState([])
  const [personalizationData, setPersonalizationData] = useState({
    rol: '',
    empresa: '',
    link: '',
    aspectos: '',
    nivel: 'Medio'
  })

  // Configurar el interceptor para manejar sesión expirada
  useEffect(() => {
    apiInterceptor.setOnSessionExpired(() => {
      setSessionExpired(true);
    });
  }, []);

  // Función para cargar datos existentes del usuario (DESACTIVADA)
  const loadExistingData = async () => {
    // Carga automática desactivada - siempre empezar desde cero
    console.log('Carga automática de datos desactivada')
  }

  // Cargar templates al montar el componente
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoadingTemplates(true)
        const templatesData = await templateService.getTemplates()
        setTemplates(templatesData)
        console.log('Templates cargados:', templatesData)
      } catch (error) {
        console.error('Error cargando templates:', error)
        // En caso de error, usar templates por defecto
        setTemplates([
          { id: 'default-1', name: 'Template 1', description: 'Template por defecto' },
          { id: 'default-2', name: 'Template 2', description: 'Template por defecto' },
          { id: 'default-3', name: 'Template 3', description: 'Template por defecto' }
        ])
      } finally {
        setLoadingTemplates(false)
      }
    }

    loadTemplates()
    loadExistingData()
  }, [])

  // Si la sesión expiró, mostrar el componente de sesión expirada
  if (sessionExpired) {
    return <SessionExpired />;
  }

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId)
  }

  const handleContinue = async () => {
    if (selectedTemplate) {
      try {
        console.log(`Template seleccionado: ${selectedTemplate}`)
        // Guardar selección de template en el backend
        await cvPrepService.selectTemplate(selectedTemplate)
        setCurrentStep('personalization') // Ir a personalización
      } catch (error) {
        console.error('Error guardando template seleccionado:', error)
        // Continuar de todas formas
        setCurrentStep('personalization')
      }
    }
  }

  const handlePersonalizationContinue = async () => {
    try {
      console.log('Datos de personalización:', personalizationData)
      // Guardar datos de personalización en el backend
      await cvPrepService.savePrefill({
        rol: personalizationData.rol,
        empresa: personalizationData.empresa,
        link: personalizationData.link,
        aspectos: personalizationData.aspectos,
        nivel: personalizationData.nivel,
        skills: skills
      })
      setCurrentStep('skills') // Ir a habilidades
    } catch (error) {
      console.error('Error guardando datos de personalización:', error)
      // Continuar de todas formas
      setCurrentStep('skills')
    }
  }

  const handleSkillsContinue = async () => {
    try {
      console.log('Habilidades:', skills)
      // Actualizar habilidades en el backend
      await cvPrepService.savePrefill({
        rol: personalizationData.rol,
        empresa: personalizationData.empresa,
        link: personalizationData.link,
        aspectos: personalizationData.aspectos,
        nivel: personalizationData.nivel,
        skills: skills
      })
      
      // GENERAR CV AUTOMÁTICAMENTE al completar habilidades
      console.log('Generando CV automáticamente...')
      setIsGeneratingCV(true)
      setGenerationError(null)
      
      // Ir inmediatamente a preview para mostrar el loader
      setCurrentStep('preview')
      
      try {
        const generationData = cvGenerationService.prepareGenerationData(
          selectedTemplate,
          personalizationData,
          skills
        )
        console.log('Datos de generación:', generationData)
        
        const result = await cvGenerationService.generateCV(generationData)
        console.log('CV generado exitosamente:', result)
        console.log('Content JSON del CV:', result.content_json)
        console.log('Estructura completa del resultado:', JSON.stringify(result, null, 2))
        setGeneratedCV(result)
        
      } catch (error) {
        console.error('Error generando CV:', error)
        setGenerationError(error.message || 'Error al generar el CV')
      } finally {
        setIsGeneratingCV(false)
      }
      
    } catch (error) {
      console.error('Error guardando habilidades:', error)
      setCurrentStep('preview')
    }
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

  const handleEditCV = () => {
    setIsEditing(true)
  }

  const handleSaveCanvas = async (sections) => {
    try {
      // Guardar las modificaciones del canvas como draft
      if (generatedCV && generatedCV.cv_version_id) {
        await cvGenerationService.saveDraft(
          generatedCV.cv_version_id,
          { sections: sections },
          null
        )
        alert('Cambios guardados exitosamente')
      }
    } catch (error) {
      console.error('Error guardando cambios del canvas:', error)
      alert('Error al guardar los cambios')
    }
  }

  const handleExportCanvas = async (sections) => {
    try {
      // Exportar el CV con las modificaciones del canvas
      if (generatedCV && generatedCV.cv_version_id) {
        const exportResult = await cvGenerationService.exportCV(
          generatedCV.cv_version_id,
          'pdf',
          true // usar draft
        )
        
        // Descargar el PDF
        if (exportResult.download_url) {
          window.open(exportResult.download_url, '_blank')
        }
      }
    } catch (error) {
      console.error('Error exportando CV:', error)
      alert('Error al exportar el CV')
    }
  }

  const handleBackFromCanvas = () => {
    setIsEditing(false)
  }

  // Función para mapear la estructura del backend a la estructura del template
  const mapBackendToTemplate = (backendData) => {
    if (!backendData) return null
    
    // Solo incluir campos que realmente tienen datos
    const personalInfo = {}
    if (backendData.header?.full_name) personalInfo.name = backendData.header.full_name
    if (backendData.header?.title) personalInfo.title = backendData.header.title
    if (backendData.header?.email) personalInfo.email = backendData.header.email
    if (backendData.header?.phone) personalInfo.phone = backendData.header.phone
    if (backendData.header?.location) personalInfo.location = backendData.header.location
    
    // Solo incluir links si existen
    const links = backendData.header?.links || []
    if (links.length > 0) {
      const linkedinLink = links.find(l => l.includes('linkedin'))
      const websiteLink = links.find(l => !l.includes('linkedin'))
      if (linkedinLink) personalInfo.linkedin = linkedinLink
      if (websiteLink) personalInfo.website = websiteLink
    }
    
    // Si no hay links, no incluir estos campos para evitar errores
    // personalInfo.linkedin y personalInfo.website solo se definen si existen
    
    // Solo incluir summary si existe
    const summary = backendData.summary?.short || backendData.summary?.long || null
    
    // Solo incluir experiencia si hay datos
    const experience = (backendData.experience || []).filter(exp => 
      exp.title || exp.company || exp.start_date || exp.end_date
    ).map(exp => ({
      position: exp.title,
      company: exp.company,
      location: exp.location,
      period: `${exp.start_date || ''} - ${exp.end_date || ''}`.trim(),
      achievements: exp.achievements || []
    })).filter(exp => exp.position || exp.company) // Solo incluir si tiene datos mínimos
    
    // Solo incluir educación si hay datos
    const education = (backendData.education || []).filter(edu => 
      edu.degree || edu.institution || edu.start_date || edu.end_date
    ).map(edu => ({
      degree: edu.degree,
      institution: edu.institution,
      location: edu.location,
      period: `${edu.start_date || ''} - ${edu.end_date || ''}`.trim()
    })).filter(edu => edu.degree || edu.institution) // Solo incluir si tiene datos mínimos
    
    // Solo incluir habilidades técnicas si hay datos
    const technicalSkills = (backendData.skills?.hard || []).filter(skill => skill.name).map(skill => ({
      name: skill.name,
      level: skill.level === 'experto' ? 5 : skill.level === 'avanzado' ? 4 : skill.level === 'intermedio' ? 3 : 2
    }))
    
    // Solo incluir idiomas si hay datos válidos
    const languages = (backendData.skills?.languages || []).filter(lang => 
      lang.name && lang.name !== 'LANGUAGES' && lang.name.trim().length > 0
    ).map(lang => ({
      name: lang.name,
      level: lang.level
    }))
    
    // Solo incluir logros si hay datos
    const achievements = (backendData.extras?.awards || []).filter(award => 
      award.title && award.description
    ).map(award => ({
      title: award.title,
      description: award.description
    }))
    
    // Solo incluir certificaciones si hay datos
    const certifications = (backendData.certifications || []).filter(cert => 
      cert.name && cert.issuer
    ).map(cert => ({
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date
    }))
    
    // Solo incluir proyectos si hay datos
    const projects = (backendData.projects || []).filter(project => 
      project && (typeof project === 'string' ? project.trim().length > 0 : (project.name || project.description))
    ).map(project => typeof project === 'string' ? project : (project.name || project.description || 'Proyecto'))
    
    return {
      personalInfo,
      summary,
      experience: experience.length > 0 ? experience : undefined,
      education: education.length > 0 ? education : undefined,
      skills: {
        technical: technicalSkills.length > 0 ? technicalSkills : undefined,
        languages: languages.length > 0 ? languages : undefined
      },
      achievements: achievements.length > 0 ? achievements : undefined,
      certifications: certifications.length > 0 ? certifications : undefined,
      projects: projects.length > 0 ? projects : undefined
    }
  }

  const handleSaveCV = async () => {
    if (!cvName.trim()) {
      alert('Por favor, ingresa un nombre para tu CV')
      return
    }

    try {
      // Guardar el CV con nombre en el backend
      if (generatedCV && generatedCV.cv_version_id) {
        await cvGenerationService.saveDraft(
          generatedCV.cv_version_id,
          { 
            sections: generatedCV.content_json,
            cv_name: cvName.trim()
          },
          cvName.trim()
        )
        
        alert('¡CV guardado exitosamente!')
        setShowSaveDialog(false)
        setCvName('')
        
        // Opcional: redirigir al historial de CVs
        // setCurrentStep('history')
      }
    } catch (error) {
      console.error('Error guardando CV:', error)
      alert('Error al guardar el CV: ' + (error.message || 'Error desconocido'))
    }
  }

  const handleOpenSaveDialog = () => {
    setShowSaveDialog(true)
    // Generar nombre sugerido basado en el rol
    if (personalizationData.rol && !cvName) {
      setCvName(`${personalizationData.rol} - ${new Date().toLocaleDateString('es-ES')}`)
    }
  }

  // Función para transformar el CV generado en secciones para el editor
  const transformCVToSections = (cvData) => {
    if (!cvData?.content_json) return []
    
    const sections = []
    let yOffset = 50
    
    // Header section
    if (cvData.content_json.header) {
      sections.push({
        id: 'header',
        type: 'header',
        content: {
          name: cvData.content_json.header.full_name || 'MATIAS SANTORO',
          title: cvData.content_json.header.title || 'Cloud Engineer',
          email: cvData.content_json.header.email || 'matisantoro10@gmail.com',
          phone: cvData.content_json.header.phone || '',
          location: cvData.content_json.header.location || 'Argentina'
        },
        position: { x: 50, y: yOffset },
        size: { width: 500, height: 120 },
        style: {
          backgroundColor: '#2563eb',
          color: 'white',
          borderRadius: '8px',
          padding: '20px'
        }
      })
      yOffset += 150
    }
    
    // Summary section
    if (cvData.content_json.summary?.short || cvData.content_json.summary?.long) {
      sections.push({
        id: 'summary',
        type: 'summary',
        content: {
          text: cvData.content_json.summary.short || cvData.content_json.summary.long || ''
        },
        position: { x: 50, y: yOffset },
        size: { width: 500, height: 100 },
        style: {
          backgroundColor: 'white',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px'
        }
      })
      yOffset += 130
    }
    
    // Experience section
    if (cvData.content_json.experience && cvData.content_json.experience.length > 0) {
      const experienceHeight = Math.max(200, cvData.content_json.experience.length * 80)
      sections.push({
        id: 'experience',
        type: 'experience',
        content: cvData.content_json.experience.map(exp => ({
          title: exp.role || exp.title,
          company: exp.company,
          period: `${exp.start_date || ''} - ${exp.end_date || 'Presente'}`,
          highlights: exp.highlights || []
        })),
        position: { x: 50, y: yOffset },
        size: { width: 500, height: experienceHeight },
        style: {
          backgroundColor: 'white',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px'
        }
      })
      yOffset += experienceHeight + 20
    }
    
    // Skills section
    if (cvData.content_json.skills) {
      const skillsHeight = 200
      sections.push({
        id: 'skills',
        type: 'skills',
        content: cvData.content_json.skills,
        position: { x: 600, y: 200 },
        size: { width: 300, height: skillsHeight },
        style: {
          backgroundColor: 'white',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px'
        }
      })
    }
    
    // Education section
    if (cvData.content_json.education && cvData.content_json.education.length > 0) {
      const educationHeight = Math.max(150, cvData.content_json.education.length * 60)
      sections.push({
        id: 'education',
        type: 'education',
        content: cvData.content_json.education.map(edu => ({
          degree: edu.degree,
          institution: edu.institution,
          period: `${edu.start_date || ''} - ${edu.end_date || ''}`,
          field: edu.field
        })),
        position: { x: 50, y: yOffset },
        size: { width: 500, height: educationHeight },
        style: {
          backgroundColor: 'white',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px'
        }
      })
      yOffset += educationHeight + 20
    }
    
    // Certifications section
    if (cvData.content_json.certifications && cvData.content_json.certifications.length > 0) {
      const certHeight = Math.max(120, cvData.content_json.certifications.length * 40)
      sections.push({
        id: 'certifications',
        type: 'certifications',
        content: cvData.content_json.certifications.map(cert => ({
          name: cert.name,
          issuer: cert.issuer || '',
          date: cert.date || ''
        })),
        position: { x: 600, y: yOffset },
        size: { width: 300, height: certHeight },
        style: {
          backgroundColor: 'white',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px'
        }
      })
    }
    
    // Languages section
    if (cvData.content_json.languages && cvData.content_json.languages.length > 0) {
      const languagesHeight = Math.max(100, cvData.content_json.languages.length * 30)
      sections.push({
        id: 'languages',
        type: 'languages',
        content: cvData.content_json.languages.filter(lang => 
          lang.name && lang.name !== 'LANGUAGES'
        ).map(lang => ({
          name: lang.name,
          level: lang.level
        })),
        position: { x: 600, y: yOffset + 100 },
        size: { width: 300, height: languagesHeight },
        style: {
          backgroundColor: 'white',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px'
        }
      })
    }
    
    return sections
  }

  // Si estamos en modo edición, mostrar el canvas editor
  if (isEditing && generatedCV) {
    const sections = transformCVToSections(generatedCV)
    console.log('Secciones para el editor:', sections)
    
    return (
      <CVCanvasEditor
        sections={sections}
        template={templates.find(t => t.id === selectedTemplate)}
        onSave={handleSaveCanvas}
        onExport={handleExportCanvas}
        onBack={handleBackFromCanvas}
      />
    )
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
          {loadingTemplates ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-full bg-gray-200 rounded-2xl animate-pulse" style={{ aspectRatio: '0.7', minHeight: '300px' }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="mt-4 w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            // Templates loaded
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {templates.map((template) => (
                <div key={template.id} className="flex flex-col items-center">
                  {/* Contenedor de la card con estilos existentes */}
                  <div 
                    className={`w-full bg-white rounded-2xl shadow-lg border-2 transition-all cursor-pointer hover:shadow-xl ${
                      selectedTemplate === template.id 
                        ? 'border-blue-500' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                    style={{ aspectRatio: '0.7', minHeight: '300px' }}
                  >
                    {/* Preview del template usando el nuevo componente */}
                    <TemplatePreview
                      template={template}
                      isSelected={selectedTemplate === template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                    />
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
          )}

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
                    <div className="col-span-2 flex justify-start">
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
                {isGeneratingCV ? 'Generando tu CV...' : 'Tu CV Personalizado'}
              </h1>
              <p className="text-gray-600">
                {isGeneratingCV ? 'Procesando con IA...' : 'Vista previa final'}
              </p>
              
              {generationError && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="font-medium">Error al generar el CV</span>
                  </div>
                  <p className="mt-1 text-sm text-red-600">{generationError}</p>
                  <button
                    onClick={() => setCurrentStep('skills')}
                    className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                  >
                    Volver a intentar
                  </button>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              {isGeneratingCV ? (
                <div className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generando CV...</span>
                </div>
              ) : generatedCV ? (
                <>
                  <button 
                    onClick={handleEditCV}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Editar CV
                  </button>
                  <button 
                    onClick={handleOpenSaveDialog}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Guardar CV
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Descargar PDF
                  </button>
                </>
              ) : (
                <div className="text-red-600 text-sm">
                  Error: No se pudo generar el CV
                </div>
              )}
            </div>
          </div>

          {/* Template completo */}
          <div className="bg-gray-100 p-8 rounded-2xl">
            {isGeneratingCV ? (
              <div className="flex items-center justify-center h-64">
                <EmpleateLoader 
                  size="large" 
                  text="Generando tu CV con IA..." 
                />
              </div>
            ) : generatedCV ? (
              <CVTemplate1 cvData={mapBackendToTemplate(generatedCV.content_json)} />
            ) : (
              <div className="text-center py-16">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No se pudo generar el CV</h3>
                  <p className="text-gray-600 mb-6">Hubo un problema durante la generación. Revisa los detalles del error arriba.</p>
                </div>
                <div className="space-x-4">
                  <button
                    onClick={() => setCurrentStep('skills')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Volver a intentar
                  </button>
                  <button
                    onClick={() => setCurrentStep('selection')}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Empezar de nuevo
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal para guardar CV */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Guardar tu CV</h3>
              <p className="text-gray-600">Dale un nombre a tu CV para poder encontrarlo después</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del CV <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cvName}
                onChange={(e) => setCvName(e.target.value)}
                placeholder="Ej: Desarrollador Backend - 2024"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                autoFocus
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCV}
                disabled={!cvName.trim()}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Guardar CV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}