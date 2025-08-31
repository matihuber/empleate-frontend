import React, { useState, useEffect } from 'react'
import { Clock, Eye, Edit3, Download, Trash2, Plus } from 'lucide-react'
import cvGenerationService from '../services/cvGenerationService'

const CVHistory = ({ onNewCV, onEditCV }) => {
  const [cvHistory, setCvHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCVHistory()
  }, [])

  const loadCVHistory = async () => {
    try {
      setLoading(true)
      // TODO: Implementar endpoint para obtener historial de CVs
      // Por ahora, usamos datos de ejemplo
      const mockHistory = [
        {
          id: 'cv-1',
          name: 'CV Desarrollador Full Stack',
          template: 'Moderno',
          created_at: '2024-01-15T10:30:00Z',
          version: 1,
          last_modified: '2024-01-15T10:30:00Z'
        },
        {
          id: 'cv-2',
          name: 'CV Ingeniero de Software',
          template: 'Clásico',
          created_at: '2024-01-10T14:20:00Z',
          version: 2,
          last_modified: '2024-01-12T16:45:00Z'
        }
      ]
      setCvHistory(mockHistory)
    } catch (error) {
      console.error('Error loading CV history:', error)
      setError('Error al cargar el historial de CVs')
    } finally {
      setLoading(false)
    }
  }

  const handleViewCV = (cvId) => {
    // TODO: Implementar vista de CV
    console.log('Viewing CV:', cvId)
  }

  const handleEditCV = (cvId) => {
    if (onEditCV) {
      onEditCV(cvId)
    }
  }

  const handleDownloadCV = async (cvId) => {
    try {
      // TODO: Implementar descarga de CV
      console.log('Downloading CV:', cvId)
    } catch (error) {
      console.error('Error downloading CV:', error)
      alert('Error al descargar el CV')
    }
  }

  const handleDeleteCV = async (cvId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este CV?')) {
      try {
        // TODO: Implementar eliminación de CV
        console.log('Deleting CV:', cvId)
        setCvHistory(prev => prev.filter(cv => cv.id !== cvId))
      } catch (error) {
        console.error('Error deleting CV:', error)
        alert('Error al eliminar el CV')
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={loadCVHistory}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Historial de CVs
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Gestiona y edita tus CVs creados
          </p>
        </div>
        
        <button
          onClick={onNewCV}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Crear Nuevo CV</span>
        </button>
      </div>

      {/* Lista de CVs */}
      {cvHistory.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <Clock size={64} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No tienes CVs creados
          </h3>
          <p className="text-gray-500 mb-6">
            Comienza creando tu primer CV profesional
          </p>
          <button
            onClick={onNewCV}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear mi primer CV
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {cvHistory.map((cv) => (
            <div
              key={cv.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {cv.name}
                    </h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      V{cv.version}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Template: {cv.template}</span>
                    </span>
                    <span>Creado: {formatDate(cv.created_at)}</span>
                    {cv.last_modified !== cv.created_at && (
                      <span>Modificado: {formatDate(cv.last_modified)}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewCV(cv.id)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Ver CV"
                  >
                    <Eye size={18} />
                  </button>
                  
                  <button
                    onClick={() => handleEditCV(cv.id)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar CV"
                  >
                    <Edit3 size={18} />
                  </button>
                  
                  <button
                    onClick={() => handleDownloadCV(cv.id)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Descargar PDF"
                  >
                    <Download size={18} />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteCV(cv.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar CV"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CVHistory
