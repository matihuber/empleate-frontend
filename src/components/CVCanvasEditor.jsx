import React from 'react'
import CVEditor from './CVEditor'

const CVCanvasEditor = ({ cvData, template, onSave, onExport, onBack }) => {
  console.log('🔍 CVCanvasEditor: Datos recibidos:', cvData)
  
  // Los datos ya vienen transformados desde CVCreation
  const transformedCVData = cvData || {
    id: 'cv-1',
    name: 'Mi CV Personalizado',
    template: template?.id || 'moderno',
    personalInfo: {
      fullName: 'Tu Nombre',
      email: 'email@ejemplo.com',
      phone: 'Teléfono',
      location: 'Ubicación',
      title: 'Título Profesional',
    },
    summary: 'Resumen profesional...',
    experience: [],
    education: [],
    skills: ['Habilidad 1', 'Habilidad 2'],
    certifications: [],
    projects: [],
  }
  
  console.log('✅ CVCanvasEditor: Datos finales para el editor:', transformedCVData)

  return (
    <CVEditor
      initialCVData={transformedCVData}
      selectedTemplate={template?.id || 'moderno'}
      onBack={onBack}
      onSave={onSave}
      onExport={onExport}
    />
  )
}

export default CVCanvasEditor
