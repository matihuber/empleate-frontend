import React, { useState, useMemo, useCallback } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { X, Save, RotateCcw } from 'lucide-react'

// Componente para editar texto rico con Slate.js
const RichTextEditor = ({ value, onChange, placeholder, className = '' }) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'paragraph':
        return <p {...props.attributes}>{props.children}</p>
      case 'heading':
        return <h3 {...props.attributes}>{props.children}</h3>
      default:
        return <p {...props.attributes}>{props.children}</p>
    }
  }, [])
  
  const renderLeaf = useCallback(props => {
    return <span {...props.attributes}>{props.children}</span>
  }, [])
  
  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={placeholder}
        className={`min-h-[100px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
    </Slate>
  )
}

// Componente para editar campos simples
const TextField = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
)

// Componente para editar arrays de elementos
const ArrayField = ({ label, items, onChange, renderItem, addItem, removeItem }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {renderItem(item, index, onChange)}
          <button
            onClick={() => removeItem(index)}
            className="p-1 text-red-600 hover:text-red-800"
            title="Eliminar"
          >
            <X size={16} />
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
      >
        + Agregar {label.toLowerCase()}
      </button>
    </div>
  </div>
)

// Modal principal de edición
const SectionEditModal = ({ 
  section, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [editedSection, setEditedSection] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Inicializar sección editada cuando se abre el modal
  React.useEffect(() => {
    if (section && isOpen) {
      setEditedSection(JSON.parse(JSON.stringify(section)))
    }
  }, [section, isOpen])
  
  if (!isOpen || !editedSection) return null
  
  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onSave(editedSection)
      onClose()
    } catch (error) {
      console.error('Error saving section:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleReset = () => {
    setEditedSection(JSON.parse(JSON.stringify(section)))
  }
  
  const updateContent = (field, value) => {
    setEditedSection(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value
      }
    }))
  }
  
  const updateArrayContent = (field, index, subField, value) => {
    setEditedSection(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: prev.content[field].map((item, i) => 
          i === index ? { ...item, [subField]: value } : item
        )
      }
    }))
  }
  
  const addArrayItem = (field, defaultItem) => {
    setEditedSection(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: [...(prev.content[field] || []), defaultItem]
      }
    }))
  }
  
  const removeArrayItem = (field, index) => {
    setEditedSection(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: prev.content[field].filter((_, i) => i !== index)
      }
    }))
  }
  
  const renderEditForm = () => {
    switch (editedSection.type) {
      case 'header':
        return (
          <>
            <TextField
              label="Nombre completo"
              value={editedSection.content.name || ''}
              onChange={(e) => updateContent('name', e.target.value)}
              placeholder="Tu nombre completo"
            />
            <TextField
              label="Título profesional"
              value={editedSection.content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              placeholder="Ej: Cloud Engineer, Developer, etc."
            />
            <TextField
              label="Email"
              value={editedSection.content.email || ''}
              onChange={(e) => updateContent('email', e.target.value)}
              placeholder="tu@email.com"
              type="email"
            />
            <TextField
              label="Teléfono"
              value={editedSection.content.phone || ''}
              onChange={(e) => updateContent('phone', e.target.value)}
              placeholder="+54 11 1234-5678"
            />
            <TextField
              label="Ubicación"
              value={editedSection.content.location || ''}
              onChange={(e) => updateContent('location', e.target.value)}
              placeholder="Ciudad, País"
            />
          </>
        )
        
      case 'summary':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resumen profesional
            </label>
            <RichTextEditor
              value={[{ type: 'paragraph', children: [{ text: editedSection.content.text || '' }] }]}
              onChange={(value) => updateContent('text', value[0]?.children[0]?.text || '')}
              placeholder="Describe tu perfil profesional..."
              className="min-h-[120px]"
            />
          </div>
        )
        
      case 'experience':
        return (
          <ArrayField
            label="Experiencias laborales"
            items={editedSection.content || []}
            onChange={updateArrayContent}
            addItem={() => addArrayItem('', {
              title: '',
              company: '',
              period: '',
              highlights: []
            })}
            removeItem={(index) => removeArrayItem('', index)}
            renderItem={(item, index) => (
              <div className="flex-1 space-y-2">
                <TextField
                  label="Título del puesto"
                  value={item.title || ''}
                  onChange={(e) => updateArrayContent('', index, 'title', e.target.value)}
                  placeholder="Ej: Cloud Engineer"
                />
                <TextField
                  label="Empresa"
                  value={item.company || ''}
                  onChange={(e) => updateArrayContent('', index, 'company', e.target.value)}
                  placeholder="Nombre de la empresa"
                />
                <TextField
                  label="Período"
                  value={item.period || ''}
                  onChange={(e) => updateArrayContent('', index, 'period', e.target.value)}
                  placeholder="2020 - Presente"
                />
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logros destacados
                  </label>
                  <textarea
                    value={(item.highlights || []).join('\n')}
                    onChange={(e) => updateArrayContent('', index, 'highlights', e.target.value.split('\n').filter(line => line.trim()))}
                    placeholder="Un logro por línea..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </div>
            )}
          />
        )
        
      case 'skills':
        return (
          <>
            <ArrayField
              label="Habilidades técnicas"
              items={editedSection.content.hard || []}
              onChange={updateArrayContent}
              addItem={() => addArrayItem('hard', { name: '', level: 'intermedio' })}
              removeItem={(index) => removeArrayItem('hard', index)}
              renderItem={(item, index) => (
                <div className="flex-1 flex space-x-2">
                  <input
                    value={item.name || ''}
                    onChange={(e) => updateArrayContent('hard', index, 'name', e.target.value)}
                    placeholder="Ej: Python"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={item.level || 'intermedio'}
                    onChange={(e) => updateArrayContent('hard', index, 'level', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="basico">Básico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                    <option value="experto">Experto</option>
                  </select>
                </div>
              )}
            />
            
            <ArrayField
              label="Habilidades blandas"
              items={editedSection.content.soft || []}
              onChange={updateArrayContent}
              addItem={() => addArrayItem('soft', { name: '' })}
              removeItem={(index) => removeArrayItem('soft', index)}
              renderItem={(item, index) => (
                <input
                  value={item.name || ''}
                  onChange={(e) => updateArrayContent('soft', index, 'name', e.target.value)}
                  placeholder="Ej: Trabajo en equipo"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
          </>
        )
        
      case 'education':
        return (
          <ArrayField
            label="Educación"
            items={editedSection.content || []}
            onChange={updateArrayContent}
            addItem={() => addArrayItem('', {
              degree: '',
              institution: '',
              period: '',
              field: ''
            })}
            removeItem={(index) => removeArrayItem('', index)}
            renderItem={(item, index) => (
              <div className="flex-1 space-y-2">
                <TextField
                  label="Grado académico"
                  value={item.degree || ''}
                  onChange={(e) => updateArrayContent('', index, 'degree', e.target.value)}
                  placeholder="Ej: Licenciatura en Informática"
                />
                <TextField
                  label="Institución"
                  value={item.institution || ''}
                  onChange={(e) => updateArrayContent('', index, 'institution', e.target.value)}
                  placeholder="Nombre de la universidad"
                />
                <TextField
                  label="Período"
                  value={item.period || ''}
                  onChange={(e) => updateArrayContent('', index, 'period', e.target.value)}
                  placeholder="2018 - 2022"
                />
                <TextField
                  label="Campo de estudio"
                  value={item.field || ''}
                  onChange={(e) => updateArrayContent('', index, 'field', e.target.value)}
                  placeholder="Informática, Ingeniería, etc."
                />
              </div>
            )}
          />
        )
        
      case 'certifications':
        return (
          <ArrayField
            label="Certificaciones"
            items={editedSection.content || []}
            onChange={updateArrayContent}
            addItem={() => addArrayItem('', {
              name: '',
              issuer: '',
              date: ''
            })}
            removeItem={(index) => removeArrayItem('', index)}
            renderItem={(item, index) => (
              <div className="flex-1 space-y-2">
                <TextField
                  label="Nombre de la certificación"
                  value={item.name || ''}
                  onChange={(e) => updateArrayContent('', index, 'name', e.target.value)}
                  placeholder="Ej: AWS Solutions Architect"
                />
                <TextField
                  label="Emisor"
                  value={item.issuer || ''}
                  onChange={(e) => updateArrayContent('', index, 'issuer', e.target.value)}
                  placeholder="AWS, Microsoft, etc."
                />
                <TextField
                  label="Fecha"
                  value={item.date || ''}
                  onChange={(e) => updateArrayContent('', index, 'date', e.target.value)}
                  placeholder="2023"
                />
              </div>
            )}
          />
        )
        
      case 'languages':
        return (
          <ArrayField
            label="Idiomas"
            items={editedSection.content || []}
            onChange={updateArrayContent}
            addItem={() => addArrayItem('', {
              name: '',
              level: ''
            })}
            removeItem={(index) => removeArrayItem('', index)}
            renderItem={(item, index) => (
              <div className="flex-1 flex space-x-2">
                <input
                  value={item.name || ''}
                  onChange={(e) => updateArrayContent('', index, 'name', e.target.value)}
                  placeholder="Ej: Inglés"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  value={item.level || ''}
                  onChange={(e) => updateArrayContent('', index, 'level', e.target.value)}
                  placeholder="Ej: Avanzado"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          />
        )
        
      default:
        return (
          <div className="text-gray-500 text-center py-8">
            Tipo de sección no soportado para edición
          </div>
        )
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Editar {editedSection.type.toUpperCase()}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Contenido del modal */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderEditForm()}
        </div>
        
        {/* Footer del modal */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
          >
            <RotateCcw size={16} />
            <span>Restaurar</span>
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              <span>{isLoading ? 'Guardando...' : 'Guardar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionEditModal
