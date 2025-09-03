import React, { useState } from 'react'
import { GripVertical, Edit2, Check, X } from 'lucide-react'
import ConfirmationModal from './ConfirmationModal'
import DeleteConfirmModal from './DeleteConfirmModal'

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
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

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
        setEditData(cvData.skills || [])
        break
      case "languages":
        setEditData(cvData.languages || [])
        break
      case "experience":
        setEditData(cvData.experience || [])
        break
      case "education":
        setEditData(cvData.education || [])
        break
      case "certifications":
        setEditData(cvData.certifications || [])
        break
      case "projects":
        setEditData(cvData.projects || [])
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
        onUpdate(editData)
        break
      case "languages":
        onUpdate(editData)
        break
      case "experience":
        onUpdate(editData)
        break
      case "education":
        onUpdate(editData)
        break
      case "certifications":
        onUpdate(editData)
        break
      case "projects":
        onUpdate(editData)
        break
    }
    setIsEditing(false)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditData({})
  }

  const handleDeleteItem = (index, itemName) => {
    setItemToDelete({ index, itemName })
    setShowDeleteItemModal(true)
  }

  const confirmDeleteItem = () => {
    if (itemToDelete !== null) {
      const newData = editData.filter((_, i) => i !== itemToDelete.index)
      setEditData(newData)
      setItemToDelete(null)
    }
  }

  // Función para formatear el nivel de idioma para mostrar
  const formatLanguageLevel = (level) => {
    const levelMap = {
      'A1': 'A1 - Básico',
      'A2': 'A2 - Básico alto',
      'B1': 'B1 - Conversacional',
      'B2': 'B2 - Intermedio alto',
      'C1': 'C1 - Avanzado',
      'C2': 'C2 - Fluido',
      'nativo': 'Nativo / bilingüe',
      // Mapear niveles antiguos
      'basico': 'A1 - Básico',
      'intermedio': 'B1 - Conversacional',
      'avanzado': 'C1 - Avanzado'
    }
    return levelMap[level] || level
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
          <div className="space-y-4">
            {editData.map((skill, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    value={skill.name || ""}
                    onChange={(e) => {
                      const newData = [...editData]
                      newData[index] = { ...newData[index], name: e.target.value }
                      setEditData(newData)
                    }}
                    placeholder="Nombre de la habilidad"
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={skill.level || "intermedio"}
                    onChange={(e) => {
                      const newData = [...editData]
                      newData[index] = { ...newData[index], level: e.target.value }
                      setEditData(newData)
                    }}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="basico">Básico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                    <option value="experto">Experto</option>
                  </select>
                </div>
                <button
                  onClick={() => handleDeleteItem(index, `la habilidad ${skill.name || 'seleccionada'}`)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                setEditData([...editData, { name: "", level: "intermedio" }])
              }}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
            >
              + Agregar habilidad
            </button>
          </div>
        )
      case "languages":
        return (
          <div className="space-y-4">
            {editData.map((lang, index) => (
              <div key={index} className="border border-gray-300 rounded p-4">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    value={lang.name || ""}
                    onChange={(e) => {
                      const newData = [...editData]
                      newData[index] = { ...newData[index], name: e.target.value }
                      setEditData(newData)
                    }}
                    placeholder="Idioma"
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={lang.level || "B1"}
                    onChange={(e) => {
                      const newData = [...editData]
                      newData[index] = { ...newData[index], level: e.target.value }
                      setEditData(newData)
                    }}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="A1">A1 - Básico</option>
                    <option value="A2">A2 - Básico alto</option>
                    <option value="B1">B1 - Conversacional</option>
                    <option value="B2">B2 - Intermedio alto</option>
                    <option value="C1">C1 - Avanzado</option>
                    <option value="C2">C2 - Fluido</option>
                    <option value="nativo">Nativo / bilingüe</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    const newData = editData.filter((_, i) => i !== index)
                    setEditData(newData)
                  }}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}
                              <button
                    onClick={() => {
                      setEditData([...editData, { name: "", level: "B1" }])
                    }}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                  >
                    + Agregar idioma
                  </button>
          </div>
        )
      case "experience":
        return (
          <div className="space-y-4">
            {editData.map((exp, index) => (
              <div key={index} className="border border-gray-300 rounded p-4">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <input
                    value={exp.company || ""}
                    onChange={(e) => {
                      const newData = [...editData]
                      newData[index] = { ...newData[index], company: e.target.value }
                      setEditData(newData)
                    }}
                    placeholder="Empresa"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    value={exp.position || ""}
                    onChange={(e) => {
                      const newData = [...editData]
                      newData[index] = { ...newData[index], position: e.target.value }
                      setEditData(newData)
                    }}
                    placeholder="Cargo"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <input
                    value={exp.startDate || ""}
                    onChange={(e) => {
                      const newData = [...editData]
                      newData[index] = { ...newData[index], startDate: e.target.value }
                      setEditData(newData)
                    }}
                    placeholder="Fecha inicio"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      value={exp.endDate || ""}
                      onChange={(e) => {
                        const newData = [...editData]
                        newData[index] = { ...newData[index], endDate: e.target.value }
                        setEditData(newData)
                      }}
                      placeholder="Fecha fin"
                      disabled={exp.current}
                      className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        exp.current ? 'bg-gray-100 text-gray-500' : ''
                      }`}
                    />
                    <label className="flex items-center space-x-1 text-sm">
                      <input
                        type="checkbox"
                        checked={exp.current || false}
                        onChange={(e) => {
                          const newData = [...editData]
                          newData[index] = { 
                            ...newData[index], 
                            current: e.target.checked,
                            endDate: e.target.checked ? 'Presente' : newData[index].endDate
                          }
                          setEditData(newData)
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-gray-600">Actual</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-4">
                  <textarea
                    value={exp.description || ""}
                    onChange={(e) => {
                      const newData = [...editData]
                      newData[index] = { ...newData[index], description: e.target.value }
                      setEditData(newData)
                    }}
                    placeholder="Descripción del cargo..."
                    rows={3}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleDeleteItem(index, `la experiencia en ${exp.company || 'esta empresa'}`)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => setEditData([...editData, { company: "", position: "", startDate: "", endDate: "", description: "" }])}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500"
            >
              + Agregar experiencia
            </button>
          </div>
        )
      case "education":
        return (
          <div className="space-y-4">
            {editData.map((edu, index) => (
              <div key={index} className="border border-gray-300 rounded p-4">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <input
                    value={edu.institution || ""}
                    onChange={(e) => {
                      const newData = [...editData]
                      newData[index] = { ...newData[index], institution: e.target.value }
                      setEditData(newData)
                    }}
                    placeholder="Institución"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    value={edu.degree || ""}
                    onChange={(e) => {
                      const newData = [...editData]
                      newData[index] = { ...newData[index], degree: e.target.value }
                      setEditData(newData)
                    }}
                    placeholder="Título"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-4">
                  <input
                    value={edu.year || ""}
                    onChange={(e) => {
                      const newData = [...editData]
                      newData[index] = { ...newData[index], year: e.target.value }
                      setEditData(newData)
                    }}
                    placeholder="Año"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleDeleteItem(index, `la educación en ${edu.institution || 'esta institución'}`)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => setEditData([...editData, { institution: "", degree: "", year: "" }])}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500"
            >
              + Agregar educación
            </button>
          </div>
        )
      case "certifications":
        return (
          <div className="space-y-4">
            {editData.map((cert, index) => (
              <div key={index} className="border border-gray-300 rounded p-4">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <input
                    value={cert.name || ""}
                    onChange={(e) => {
                      const newData = [...editData]
                      newData[index] = { ...newData[index], name: e.target.value }
                      setEditData(newData)
                    }}
                    placeholder="Nombre de certificación"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    value={cert.issuer || ""}
                    onChange={(e) => {
                      const newData = [...editData]
                      newData[index] = { ...newData[index], issuer: e.target.value }
                      setEditData(newData)
                    }}
                    placeholder="Emisor"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-4">
                  <input
                    value={cert.date || ""}
                    onChange={(e) => {
                      const newData = [...editData]
                      newData[index] = { ...newData[index], date: e.target.value }
                      setEditData(newData)
                    }}
                    placeholder="Fecha (YYYY-MM)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleDeleteItem(index, `la certificación ${cert.name || 'seleccionada'}`)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => setEditData([...editData, { name: "", issuer: "", date: "" }])}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500"
            >
              + Agregar certificación
            </button>
          </div>
        )
      case "projects":
        return (
          <div className="space-y-4">
            {editData.map((project, index) => (
              <div key={index} className="border border-gray-300 rounded p-4">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <input
                    value={project.name || ""}
                    onChange={(e) => {
                      const newData = [...editData]
                      newData[index] = { ...newData[index], name: e.target.value }
                      setEditData(newData)
                    }}
                    placeholder="Nombre del proyecto"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    value={project.link || ""}
                    onChange={(e) => {
                      const newData = [...editData]
                      newData[index] = { ...newData[index], link: e.target.value }
                      setEditData(newData)
                    }}
                    placeholder="URL del proyecto"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-4">
                  <textarea
                    value={project.description || ""}
                    onChange={(e) => {
                      const newData = [...editData]
                      newData[index] = { ...newData[index], description: e.target.value }
                      setEditData(newData)
                    }}
                    placeholder="Descripción del proyecto..."
                    rows={3}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleDeleteItem(index, `el proyecto ${project.name || 'seleccionado'}`)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => setEditData([...editData, { name: "", description: "", link: "" }])}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500"
            >
              + Agregar proyecto
            </button>
          </div>
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
            <p className="text-sm leading-relaxed">
              {cvData.summary || "Resumen profesional..."}
            </p>
          </div>
        )
      case "experience":
        return (
          <div>
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
            <div className="space-y-3">
              {cvData.skills?.map((skill, index) => {
                const skillName = typeof skill === 'object' ? skill.name : skill
                const skillLevel = typeof skill === 'object' ? skill.level : 'intermedio'
                const getLevelColor = (level) => {
                  switch(level) {
                    case 'basico': return 'bg-gray-100 text-gray-700 border-gray-200'
                    case 'intermedio': return 'bg-blue-100 text-blue-700 border-blue-200'
                    case 'avanzado': return 'bg-green-100 text-green-700 border-green-200'
                    case 'experto': return 'bg-purple-100 text-purple-700 border-purple-200'
                    default: return 'bg-gray-100 text-gray-700 border-gray-200'
                  }
                }
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <span className="font-medium text-gray-900">{skillName}</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getLevelColor(skillLevel)}`}>
                      {skillLevel}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      case "certifications":
        return (
          <div>
            <div className="space-y-3">
              {cvData.certifications?.map((cert, index) => (
                <div key={index} className="border-l-4 pl-4" style={{ borderColor: template.colors.accent }}>
                  <h3 className="font-semibold">{cert.name || "Certificación"}</h3>
                  <p className="text-sm text-gray-600">{cert.issuer || "Emisor"}</p>
                  <p className="text-xs text-gray-500">{cert.date || "Fecha"}</p>
                </div>
              ))}
            </div>
          </div>
        )
      case "projects":
        return (
          <div>
            <div className="space-y-4">
              {cvData.projects?.map((project, index) => (
                <div key={index} className="border-l-4 pl-4" style={{ borderColor: template.colors.accent }}>
                  <h3 className="font-semibold">{project.name || "Proyecto"}</h3>
                  <p className="text-sm text-gray-600">{project.description || "Descripción del proyecto..."}</p>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      Ver proyecto
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      case "languages":
        return (
          <div>
            <div className="space-y-3">
              {cvData.languages?.map((lang, index) => {
                const langName = typeof lang === 'object' ? lang.name : lang
                const langLevel = typeof lang === 'object' ? lang.level : 'B1'
                return (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium">{langName}</span>
                    <span className="text-sm text-gray-600">{formatLanguageLevel(langLevel)}</span>
                  </div>
                )
              })}
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
            <>
              <button
                onClick={startEditing}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                title="Editar sección"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-red-500 hover:text-red-600 transition-colors"
                title="Eliminar sección"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={saveChanges}
                className="p-2 text-green-600 hover:text-green-700 transition-colors"
                title="Guardar cambios"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={cancelEditing}
                className="p-2 text-red-600 hover:text-red-700 transition-colors"
                title="Cancelar edición"
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onUpdate(null)}
        title="Eliminar sección"
        message={`¿Estás seguro de que quieres eliminar la sección "${title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Delete Item Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteItemModal}
        onClose={() => {
          setShowDeleteItemModal(false)
          setItemToDelete(null)
        }}
        onConfirm={confirmDeleteItem}
        itemName={itemToDelete?.itemName || "este elemento"}
      />
    </div>
  )
}

export default CVSection
