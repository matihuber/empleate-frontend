import React, { useState, useRef } from 'react'
import CVSection from './CVSection'

const CVCanvas = ({ cvData, template, zoom, onCVDataChange, onZoomIn, onZoomOut }) => {
  const canvasRef = useRef(null)
  const [draggedSection, setDraggedSection] = useState(null)
  const [dragOverSection, setDragOverSection] = useState(null)

  // Define the sections that can be reordered with initial order
  const [sectionOrder, setSectionOrder] = useState([
    { id: "personal", title: "Información Personal", type: "personal" },
    { id: "summary", title: "Resumen Profesional", type: "summary" },
    { id: "experience", title: "Experiencia Laboral", type: "experience" },
    { id: "education", title: "Educación", type: "education" },
    { id: "skills", title: "Habilidades", type: "skills" },
    { id: "certifications", title: "Certificaciones", type: "certifications" },
    { id: "projects", title: "Proyectos", type: "projects" },
  ])

  // Available sections that can be added
  const availableSections = [
    { id: "personal", title: "Información Personal", type: "personal" },
    { id: "summary", title: "Resumen Profesional", type: "summary" },
    { id: "experience", title: "Experiencia Laboral", type: "experience" },
    { id: "education", title: "Educación", type: "education" },
    { id: "skills", title: "Habilidades", type: "skills" },
    { id: "certifications", title: "Certificaciones", type: "certifications" },
    { id: "projects", title: "Proyectos", type: "projects" },
  ]

  const handleDragStart = (sectionId) => {
    setDraggedSection(sectionId)
  }

  const handleDragEnd = () => {
    setDraggedSection(null)
    setDragOverSection(null)
  }

  const handleDragOver = (e, sectionId) => {
    e.preventDefault()
    if (draggedSection && draggedSection !== sectionId) {
      setDragOverSection(sectionId)
    }
  }

  const handleDragLeave = () => {
    setDragOverSection(null)
  }

  const handleDrop = (e, targetSectionId) => {
    e.preventDefault()

    if (!draggedSection || draggedSection === targetSectionId) {
      return
    }

    const newOrder = [...sectionOrder]
    const draggedIndex = newOrder.findIndex((section) => section.id === draggedSection)
    const targetIndex = newOrder.findIndex((section) => section.id === targetSectionId)

    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Remove dragged section and insert at target position
      const [draggedItem] = newOrder.splice(draggedIndex, 1)
      newOrder.splice(targetIndex, 0, draggedItem)
      setSectionOrder(newOrder)
    }

    setDraggedSection(null)
    setDragOverSection(null)
  }

  const handleSectionUpdate = (sectionType, data) => {
    if (data === null) {
      // Remove section
      setSectionOrder(prev => prev.filter(section => section.type !== sectionType))
      return
    }

    const updatedCVData = { ...cvData }

    switch (sectionType) {
      case "personal":
        updatedCVData.personalInfo = { ...updatedCVData.personalInfo, ...data }
        break
      case "summary":
        updatedCVData.summary = data
        break
      case "experience":
        updatedCVData.experience = data
        break
      case "education":
        updatedCVData.education = data
        break
      case "skills":
        updatedCVData.skills = data
        break
      case "certifications":
        updatedCVData.certifications = data
        break
      case "projects":
        updatedCVData.projects = data
        break
    }

    onCVDataChange(updatedCVData)
  }

  const handleAddSection = (sectionType) => {
    const section = availableSections.find(s => s.type === sectionType)
    if (section && !sectionOrder.find(s => s.id === section.id)) {
      setSectionOrder(prev => [...prev, section])
    }
  }

  const getAvailableSectionsToAdd = () => {
    return availableSections.filter(section => 
      !sectionOrder.find(s => s.id === section.id)
    )
  }

  // Manejar zoom con rueda del mouse
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      if (e.deltaY < 0) {
        onZoomIn?.()
      } else {
        onZoomOut?.()
      }
    }
  }

  return (
    <div 
      className="h-full overflow-auto bg-gray-100 p-8"
      onWheel={handleWheel}
    >
      <div className="flex justify-center">
        <div
          ref={canvasRef}
          className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-200"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            width: "210mm", // A4 width
            minHeight: "297mm", // A4 height
            maxWidth: "210mm",
          }}
        >
          <div
            data-cv-content
            className="p-8 min-h-full"
            style={{
              backgroundColor: template.colors.background,
              color: template.colors.text,
            }}
          >
            {sectionOrder.map((section) => (
              <div
                key={section.id}
                onDragOver={(e) => handleDragOver(e, section.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, section.id)}
                className={`transition-all duration-200 ${
                  dragOverSection === section.id ? "border-t-4 border-blue-500" : ""
                }`}
              >
                <CVSection
                  id={section.id}
                  title={section.title}
                  type={section.type}
                  cvData={cvData}
                  template={template}
                  isDragged={draggedSection === section.id}
                  onDragStart={() => handleDragStart(section.id)}
                  onDragEnd={handleDragEnd}
                  onUpdate={(data) => handleSectionUpdate(section.type, data)}
                />
              </div>
            ))}
            
            {/* Add Section Button */}
            {getAvailableSectionsToAdd().length > 0 && (
              <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <p className="text-gray-500 mb-3">Agregar nueva sección:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {getAvailableSectionsToAdd().map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleAddSection(section.type)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      + {section.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CVCanvas
