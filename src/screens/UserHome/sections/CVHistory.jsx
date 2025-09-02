import React, { useState, useEffect } from 'react'
import { cvStorageService } from '../../../services/cvStorageService'
import CVCanvasEditor from '../../../components/CVCanvasEditor'
import { getTemplateStyles } from '../../../lib/templates'
import { Trash2, X, AlertTriangle } from 'lucide-react'

const CVHistory = ({ onNavigateToSection }) => {
  const [cvs, setCvs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCV, setSelectedCV] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [cvToDelete, setCvToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Cargar CVs al montar el componente
  useEffect(() => {
    loadCVs()
  }, [])

  const loadCVs = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔍 CVHistory: Cargando CVs...')
      const result = await cvStorageService.getSavedCVs()
      
      console.log('✅ CVHistory: CVs cargados:', result)
      setCvs(result.cvs || [])
      
    } catch (error) {
      console.error('❌ CVHistory: Error cargando CVs:', error)
      setError('Error cargando el historial de CVs')
    } finally {
      setLoading(false)
    }
  }

  const handleViewCV = (cv) => {
    console.log('🔍 CVHistory: Viendo CV:', cv)
    setSelectedCV(cv)
    setIsEditing(true)
  }

  const handleDeleteCV = (cv) => {
    console.log('🔍 CVHistory: CV object structure:', cv)
    setCvToDelete(cv)
    setShowDeleteModal(true)
  }

  const confirmDeleteCV = async () => {
    if (!cvToDelete) return

    setIsDeleting(true)
    try {
      console.log('🔍 CVHistory: Eliminando CV:', cvToDelete.cv_version_id)
      await cvStorageService.deleteCV(cvToDelete.cv_version_id)
      
      // Recargar la lista
      await loadCVs()
      
      // Cerrar modal
      setShowDeleteModal(false)
      setCvToDelete(null)
      
    } catch (error) {
      console.error('❌ CVHistory: Error eliminando CV:', error)
      setError('Error eliminando el CV')
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelDeleteCV = () => {
    setShowDeleteModal(false)
    setCvToDelete(null)
  }

  const handleBackToList = () => {
    setSelectedCV(null)
    setIsEditing(false)
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch (error) {
      return 'Fecha no disponible'
    }
  }

  // Si está editando un CV, mostrar el editor
  if (isEditing && selectedCV) {
    return (
      <div className="h-full">
        <CVCanvasEditor
          cvData={selectedCV.content_json}
          template={{ id: selectedCV.template_id }}
          onSave={async (cvData) => {
            try {
              // Guardar como nueva versión
              await cvStorageService.saveCV(
                cvData, 
                `${selectedCV.name} - Editado`, 
                selectedCV.template_id
              )
              alert('✅ CV guardado exitosamente')
              await loadCVs() // Recargar lista
            } catch (error) {
              alert('❌ Error guardando CV: ' + error.message)
            }
          }}
          onExport={async (cvData) => {
            try {
              const { pdfExportService } = await import('../../../services/pdfExportService')
              await pdfExportService.exportToPDF(cvData, selectedCV.name, selectedCV.template_id)
              alert('✅ PDF exportado exitosamente')
            } catch (error) {
              alert('❌ Error exportando PDF: ' + error.message)
            }
          }}
          onBack={handleBackToList}
        />
      </div>
    )
  }

  // Mostrar lista de CVs
  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Historial de CVs
        </h1>
        <p className="text-lg text-gray-600">
          Gestiona y edita tus CVs guardados
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial de CVs...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={loadCVs}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Lista de CVs */}
      {!loading && !error && (
        <div className="space-y-4">
          {cvs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No tienes CVs guardados
              </h3>
              <p className="text-gray-500 mb-6">
                Crea tu primer CV para que aparezca aquí
              </p>
              <button
                onClick={() => onNavigateToSection('crear-cv')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear mi primer CV
              </button>
            </div>
          ) : (
            <>
              {/* Header de la tabla */}
              <div className="grid grid-cols-12 gap-4 items-center mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="col-span-4">
                  <span className="text-sm font-medium text-gray-700">Nombre del CV</span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm font-medium text-gray-700">Template</span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm font-medium text-gray-700">Fecha</span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm font-medium text-gray-700">Versión</span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm font-medium text-gray-700">Acciones</span>
                </div>
              </div>

              {/* Lista de CVs */}
              {cvs.map((cv) => (
                <div key={cv.cv_version_id} className="grid grid-cols-12 gap-4 items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  {/* Nombre */}
                  <div className="col-span-4">
                    <h3 className="font-medium text-gray-900">{cv.name}</h3>
                  </div>

                  {/* Template */}
                  <div className="col-span-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {cv.template_id}
                    </span>
                  </div>

                  {/* Fecha */}
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600">
                      {formatDate(cv.created_at)}
                    </span>
                  </div>

                  {/* Versión */}
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600">
                      v{cv.version}
                    </span>
                  </div>

                  {/* Acciones */}
                  <div className="col-span-2 flex space-x-2">
                    <button
                      onClick={() => handleViewCV(cv)}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Ver CV
                    </button>
                    <button
                      onClick={() => handleDeleteCV(cv)}
                      className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition-colors"
                      title="Eliminar CV"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Modal de confirmación para eliminar CV */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
            {/* Botón cerrar */}
            <button
              onClick={cancelDeleteCV}
              disabled={isDeleting}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                isDeleting 
                  ? 'cursor-not-allowed' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <X className={`w-5 h-5 ${isDeleting ? 'text-gray-300' : 'text-gray-500'}`} />
            </button>

            {/* Icono de advertencia */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Título */}
            <h3 className="text-xl font-bold text-gray-800 text-center mb-4">
              ¿Eliminar CV?
            </h3>

            {/* Mensaje */}
            <p className="text-gray-600 text-center mb-8">
              ¿Estás seguro de que querés eliminar <strong>"{cvToDelete?.name}"</strong>?
              <br />
              <span className="text-sm text-gray-500 mt-2 block">
                Esta acción no se puede deshacer.
              </span>
            </p>

            {/* Botones */}
            <div className="flex space-x-3">
              <button
                onClick={cancelDeleteCV}
                disabled={isDeleting}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  isDeleting 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteCV}
                disabled={isDeleting}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  isDeleting 
                    ? 'bg-red-400 text-white cursor-not-allowed' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CVHistory
