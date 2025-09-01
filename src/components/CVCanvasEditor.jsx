import React from 'react'
import CVEditor from './CVEditor'

const CVCanvasEditor = ({ cvData, template, onSave, onExport, onBack }) => {
  // Transformar los datos del CV al formato esperado por el nuevo editor
  const transformedCVData = {
    id: cvData?.id || 'cv-1',
    name: 'Mi CV Personalizado',
    template: template?.id || 'moderno',
    personalInfo: {
      fullName: cvData?.header?.name || 'Tu Nombre',
      email: cvData?.header?.email || 'email@ejemplo.com',
      phone: cvData?.header?.phone || 'Teléfono',
      location: cvData?.header?.location || 'Ubicación',
      title: cvData?.header?.title || 'Título Profesional',
    },
    summary: cvData?.summary?.text || 'Resumen profesional...',
    experience: cvData?.experience?.map((exp, index) => ({
      id: `exp-${index}`,
      company: exp.company || 'Empresa',
      position: exp.position || 'Cargo',
      startDate: exp.startDate || '2020',
      endDate: exp.endDate || '2023',
      current: exp.current || false,
      description: exp.description || 'Descripción del cargo...',
    })) || [],
    education: cvData?.education?.map((edu, index) => ({
      id: `edu-${index}`,
      institution: edu.institution || 'Institución',
      degree: edu.degree || 'Título',
      year: edu.year || '2023',
    })) || [],
    skills: cvData?.skills?.hard || ['Habilidad 1', 'Habilidad 2'],
    certifications: [],
    projects: [],
  }

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
