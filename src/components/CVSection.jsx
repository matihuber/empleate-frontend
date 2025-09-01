import React, { useState } from 'react'
import { GripVertical, Edit2, Check, X } from 'lucide-react'

const CVSection = ({
  id,
  title,
  type,
  cvData,
  template,
  isDragged,
  onDragStart,
  onDragEnd,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})

  const startEditing = () => {
    // Initialize edit data based on section type
    switch (type) {
      case "personal":
        setEditData({ ...cvData.personalInfo })
        break
      case "summary":
        setEditData(cvData.summary)
        break
      case "skills":
        setEditData(cvData.skills.join(", "))
        break
      default:
        setEditData({})
    }
    setIsEditing(true)
  }

  const saveChanges = () => {
    switch (type) {
      case "personal":
        onUpdate(editData)
        break
      case "summary":
        onUpdate(editData)
        break
      case "skills":
        onUpdate(
          editData
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        )
        break
    }
    setIsEditing(false)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditData({})
  }

  const renderEditableContent = () => {
    if (!isEditing) return renderSectionContent()

    switch (type) {
      case "personal":
        return (
          <div className="space-y-4">
            <input
              value={editData.fullName || ""}
              onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
              placeholder="Nombre completo"
              className="w-full px-3 py-2 text-2xl font-bold border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                value={editData.email || ""}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                value={editData.phone || ""}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                placeholder="Teléfono"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              value={editData.location || ""}
              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
              placeholder="Ubicación"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )
      case "summary":
        return (
          <textarea
            value={editData}
            onChange={(e) => setEditData(e.target.value)}
            placeholder="Resumen profesional..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )
      case "skills":
        return (
          <textarea
            value={editData}
            onChange={(e) => setEditData(e.target.value)}
            placeholder="Habilidades separadas por comas..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )
      default:
        return <div>Edición no disponible para esta sección</div>
    }
  }

  const renderSectionContent = () => {
    switch (type) {
      case "personal":
        return (
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold" style={{ color: template.colors.primary }}>
              {cvData.personalInfo?.fullName || "Tu Nombre"}
            </h1>
            <p className="text-xl" style={{ color: template.colors.accent }}>
              {cvData.personalInfo?.title || "Título Profesional"}
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <span>{cvData.personalInfo?.email || "email@ejemplo.com"}</span>
              <span>{cvData.personalInfo?.phone || "Teléfono"}</span>
              <span>{cvData.personalInfo?.location || "Ubicación"}</span>
            </div>
          </div>
        )
      case "summary":
        return (
          <div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: template.colors.primary }}>
              Resumen Profesional
            </h2>
            <p className="text-sm leading-relaxed">
              {cvData.summary || "Resumen profesional..."}
            </p>
          </div>
        )
      case "experience":
        return (
          <div>
            <h2 className="text-lg font-semibold mb-3" style={{ color: template.colors.primary }}>
              Experiencia Laboral
            </h2>
            <div className="space-y-4">
              {cvData.experience?.map((exp, index) => (
                <div key={index} className="border-l-4 pl-4" style={{ borderColor: template.colors.accent }}>
                  <h3 className="font-semibold">{exp.company || "Empresa"}</h3>
                  <p className="text-sm text-gray-600">{exp.position || "Cargo"}</p>
                  <p className="text-xs text-gray-500">{exp.startDate} - {exp.current ? "Presente" : exp.endDate}</p>
                  <p className="text-sm mt-1">{exp.description || "Descripción del cargo..."}</p>
                </div>
              ))}
            </div>
          </div>
        )
      case "education":
        return (
          <div>
            <h2 className="text-lg font-semibold mb-3" style={{ color: template.colors.primary }}>
              Educación
            </h2>
            <div className="space-y-3">
              {cvData.education?.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-semibold">{edu.degree || "Título"}</h3>
                  <p className="text-sm text-gray-600">{edu.institution || "Institución"}</p>
                  <p className="text-xs text-gray-500">{edu.year || "Año"}</p>
                </div>
              ))}
            </div>
          </div>
        )
      case "skills":
        return (
          <div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: template.colors.primary }}>
              Habilidades
            </h2>
            <div className="flex flex-wrap gap-2">
              {cvData.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded-full"
                  style={{
                    backgroundColor: template.colors.secondary,
                    color: template.colors.text
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )
      default:
        return <div>Contenido no disponible</div>
    }
  }

  return (
    <div
      className={`relative p-6 mb-6 rounded-lg border-2 transition-all duration-200 ${
        isDragged ? "opacity-50 scale-95" : ""
      }`}
      style={{
        backgroundColor: template.colors.background,
        borderColor: template.colors.secondary,
      }}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 left-2 cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: template.colors.primary }}>
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <button
              onClick={startEditing}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={saveChanges}
                className="p-2 text-green-600 hover:text-green-700 transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={cancelEditing}
                className="p-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Section Content */}
      <div style={{ color: template.colors.text }}>
        {renderEditableContent()}
      </div>
    </div>
  )
}

export default CVSection
