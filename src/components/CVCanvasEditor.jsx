import React, { useState, useRef, useEffect } from 'react'
import { Move, Edit3, Save, RotateCcw, Download } from 'lucide-react'

const CVCanvasEditor = ({
  sections,
  template,
  onSave,
  onExport,
  onBack
}) => {
  const [editorSections, setEditorSections] = useState(sections || [])
  const [selectedSection, setSelectedSection] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef(null)

  // Actualizar secciones cuando cambien las props
  useEffect(() => {
    if (sections) {
      setEditorSections(sections)
    }
  }, [sections])

  const handleMouseDown = (e, sectionId) => {
    if (e.target.closest('.editable-text')) return // No drag si se está editando texto
    
    const section = editorSections.find(s => s.id === sectionId)
    if (!section) return

    const rect = canvasRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - section.position.x
    const offsetY = e.clientY - rect.top - section.position.y
    
    setDragOffset({ x: offsetX, y: offsetY })
    setSelectedSection(sectionId)
    setIsDragging(true)
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedSection) return

    const rect = canvasRef.current.getBoundingClientRect()
    const newX = e.clientX - rect.left - dragOffset.x
    const newY = e.clientY - rect.top - dragOffset.y

    setEditorSections(prev => prev.map(section => 
      section.id === selectedSection 
        ? { ...section, position: { x: newX, y: newY } }
        : section
    ))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setSelectedSection(null)
  }

  const handleTextEdit = (sectionId, field, value) => {
    setEditorSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        if (field.includes('.')) {
          const [parent, child] = field.split('.')
          return {
            ...section,
            content: {
              ...section.content,
              [parent]: {
                ...section.content[parent],
                [child]: value
              }
            }
          }
        } else {
          return {
            ...section,
            content: {
              ...section.content,
              [field]: value
            }
          }
        }
      }
      return section
    }))
  }

  const renderSection = (section) => {
    const isSelected = selectedSection === section.id
    const isSectionDragging = isDragging && selectedSection === section.id

    return (
      <div
        key={section.id}
        className={`absolute cursor-move ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        style={{
          left: section.position.x,
          top: section.position.y,
          width: section.size.width,
          height: section.size.height,
          ...section.style,
          zIndex: isSelected ? 10 : 1,
          opacity: isSectionDragging ? 0.8 : 1
        }}
        onMouseDown={(e) => handleMouseDown(e, section.id)}
      >
        {/* Header de sección con controles */}
        <div className="flex items-center justify-between mb-2 p-2 bg-gray-100 rounded-t">
          <span className="text-xs font-medium text-gray-600 uppercase">
            {section.type}
          </span>
          <div className="flex space-x-1">
            <button
              className="p-1 text-gray-500 hover:text-gray-700"
              title="Editar"
              onClick={() => setEditingText(section.id)}
            >
              <Edit3 size={12} />
            </button>
            <Move size={12} className="text-gray-400" />
          </div>
        </div>

        {/* Contenido de la sección */}
        <div className="p-2">
          {section.type === 'header' && (
            <div>
              <div className="text-2xl font-bold mb-2">
                {editingText === `${section.id}.name` ? (
                  <input
                    type="text"
                    value={section.content.name}
                    onChange={(e) => handleTextEdit(section.id, 'name', e.target.value)}
                    className="w-full bg-transparent border-b border-white text-white"
                    onBlur={() => setEditingText('')}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="editable-text cursor-pointer hover:bg-blue-600 px-1 rounded"
                    onClick={() => setEditingText(`${section.id}.name`)}
                  >
                    {section.content.name}
                  </div>
                )}
              </div>
              <div className="text-lg opacity-90">
                {editingText === `${section.id}.title` ? (
                  <input
                    type="text"
                    value={section.content.title}
                    onChange={(e) => handleTextEdit(section.id, 'title', e.target.value)}
                    className="w-full bg-transparent border-b border-white text-white"
                    onBlur={() => setEditingText('')}
                    autoFocus
                  />
                ) : (
                  <div 
                    className="editable-text cursor-pointer hover:bg-blue-600 px-1 rounded"
                    onClick={() => setEditingText(`${section.id}.title`)}
                  >
                    {section.content.title}
                  </div>
                )}
              </div>
            </div>
          )}

          {section.type === 'summary' && (
            <div>
              {editingText === `${section.id}.text` ? (
                <textarea
                  value={section.content.text}
                  onChange={(e) => handleTextEdit(section.id, 'text', e.target.value)}
                  className="w-full bg-transparent border border-gray-300 rounded p-2"
                  rows={3}
                  onBlur={() => setEditingText('')}
                  autoFocus
                />
              ) : (
                <div 
                  className="editable-text cursor-pointer hover:bg-gray-100 px-1 rounded"
                  onClick={() => setEditingText(`${section.id}.text`)}
                >
                  {section.content.text}
                </div>
              )}
            </div>
          )}

          {section.type === 'experience' && (
            <div>
              <h3 className="font-semibold mb-2">Experiencia</h3>
              {Array.isArray(section.content) ? section.content.map((item, index) => (
                <div key={index} className="mb-3">
                  <div className="font-medium">
                    {editingText === `${section.id}.items.${index}.title` ? (
                      <input
                        type="text"
                        value={item.title || item.role || ''}
                        onChange={(e) => {
                          const newItems = [...section.content]
                          newItems[index] = { ...newItems[index], title: e.target.value }
                          handleTextEdit(section.id, 'items', newItems)
                        }}
                        className="w-full bg-transparent border-b border-gray-300"
                        onBlur={() => setEditingText('')}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="editable-text cursor-pointer hover:bg-gray-100 px-1 rounded"
                        onClick={() => setEditingText(`${section.id}.items.${index}.title`)}
                      >
                        {item.title || item.role || 'Título del puesto'}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.company || 'Empresa'} • {item.period || `${item.start_date || ''} - ${item.end_date || 'Presente'}`}
                  </div>
                  {item.highlights && item.highlights.length > 0 && (
                    <ul className="text-sm text-gray-600 mt-1 ml-4">
                      {item.highlights.map((highlight, hIndex) => (
                        <li key={hIndex} className="list-disc">{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )) : (
                <div className="text-gray-500">No hay experiencia laboral</div>
              )}
            </div>
          )}

          {section.type === 'skills' && (
            <div>
              <h3 className="font-semibold mb-2">Habilidades</h3>
              <div className="space-y-3">
                {/* Habilidades técnicas */}
                {section.content.hard && section.content.hard.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-2">Técnicas</h4>
                    <div className="flex flex-wrap gap-2">
                      {section.content.hard.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                        >
                          {skill.name} ({skill.level})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Habilidades blandas */}
                {section.content.soft && section.content.soft.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-2">Blandas</h4>
                    <div className="flex flex-wrap gap-2">
                      {section.content.soft.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Keywords ATS */}
                {section.content.keywords_ats && section.content.keywords_ats.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-2">Palabras clave ATS</h4>
                    <div className="flex flex-wrap gap-2">
                      {section.content.keywords_ats.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {section.type === 'education' && (
            <div>
              <h3 className="font-semibold mb-2">Educación</h3>
              {Array.isArray(section.content) ? section.content.map((item, index) => (
                <div key={index} className="mb-3">
                  <div className="font-medium">
                    {editingText === `${section.id}.items.${index}.degree` ? (
                      <input
                        type="text"
                        value={item.degree || ''}
                        onChange={(e) => {
                          const newItems = [...section.content]
                          newItems[index] = { ...newItems[index], degree: e.target.value }
                          handleTextEdit(section.id, 'items', newItems)
                        }}
                        className="w-full bg-transparent border-b border-gray-300"
                        onBlur={() => setEditingText('')}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="editable-text cursor-pointer hover:bg-gray-100 px-1 rounded"
                        onClick={() => setEditingText(`${section.id}.items.${index}.degree`)}
                      >
                        {item.degree || 'Grado académico'}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.institution || 'Institución'} • {item.start_date || ''} - {item.end_date || ''}
                  </div>
                </div>
              )) : (
                <div className="text-gray-500">No hay información educativa</div>
              )}
            </div>
          )}

          {section.type === 'certifications' && (
            <div>
              <h3 className="font-semibold mb-2">Certificaciones</h3>
              {Array.isArray(section.content) ? section.content.map((item, index) => (
                <div key={index} className="mb-2">
                  <div className="font-medium">
                    {editingText === `${section.id}.items.${index}.name` ? (
                      <input
                        type="text"
                        value={item.name || ''}
                        onChange={(e) => {
                          const newItems = [...section.content]
                          newItems[index] = { ...newItems[index], name: e.target.value }
                          handleTextEdit(section.id, 'items', newItems)
                        }}
                        className="w-full bg-transparent border-b border-gray-300"
                        onBlur={() => setEditingText('')}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="editable-text cursor-pointer hover:bg-gray-100 px-1 rounded"
                        onClick={() => setEditingText(`${section.id}.items.${index}.name`)}
                      >
                        {item.name || 'Nombre de certificación'}
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-gray-500">No hay certificaciones</div>
              )}
            </div>
          )}

          {section.type === 'languages' && (
            <div>
              <h3 className="font-semibold mb-2">Idiomas</h3>
              {Array.isArray(section.content) ? section.content.map((item, index) => (
                <div key={index} className="mb-2">
                  <div className="font-medium">
                    {editingText === `${section.id}.items.${index}.name` ? (
                      <input
                        type="text"
                        value={item.name || ''}
                        onChange={(e) => {
                          const newItems = [...section.content]
                          newItems[index] = { ...newItems[index], name: e.target.value }
                          handleTextEdit(section.id, 'items', newItems)
                        }}
                        className="w-full bg-transparent border-b border-gray-300"
                        onBlur={() => setEditingText('')}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="editable-text cursor-pointer hover:bg-gray-100 px-1 rounded"
                        onClick={() => setEditingText(`${section.id}.items.${index}.name`)}
                      >
                        {item.name || 'Idioma'}
                      </div>
                    )}
                  </div>
                  {item.level && (
                    <div className="text-sm text-gray-600">Nivel: {item.level}</div>
                  )}
                </div>
              )) : (
                <div className="text-gray-500">No hay idiomas</div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleSave = () => {
    if (onSave) {
      onSave(editorSections)
    }
  }

  const handleExport = () => {
    if (onExport) {
      onExport(editorSections)
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <RotateCcw size={16} />
            <span>Volver</span>
          </button>
          <h2 className="text-lg font-semibold">Editor de CV</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={16} />
            <span>Guardar</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={16} />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div
          ref={canvasRef}
          className="relative w-full h-full min-h-[800px]"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {editorSections.map(renderSection)}
          
          {/* Instrucciones */}
          <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
            <h3 className="font-semibold mb-2">Instrucciones</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Arrastra las secciones para reposicionarlas</li>
              <li>• Haz click en el texto para editarlo</li>
              <li>• Usa los controles para personalizar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CVCanvasEditor
