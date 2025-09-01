import React, { useState, useCallback, useRef } from 'react'
import CVEditorToolbar from './CVEditorToolbar'
import CVCanvas from './CVCanvas'
import { getTemplateStyles } from '../lib/templates'

const CVEditor = ({ initialCVData, selectedTemplate, onBack }) => {
  const [cvData, setCVData] = useState(initialCVData)
  const [zoom, setZoom] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const canvasRef = useRef(null)

  const template = getTemplateStyles(selectedTemplate)

  const handleCVNameChange = useCallback((name) => {
    setCVData((prev) => ({ ...prev, name }))
  }, [])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate network delay
      
      // Save to localStorage for now
      localStorage.setItem('cvData', JSON.stringify(cvData))

      // Show success message
      alert(`${cvData.name} se ha guardado correctamente.`)
    } catch (error) {
      alert('No se pudo guardar el CV. Inténtalo de nuevo.')
    } finally {
      setIsSaving(false)
    }
  }, [cvData])

  const handleExportPDF = useCallback(async () => {
    if (!canvasRef.current) {
      alert('No se pudo encontrar el contenido del CV para exportar.')
      return
    }

    setIsExporting(true)
    try {
      // For now, just show a success message
      // In a real implementation, you would use html2canvas + jsPDF
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      alert(`${cvData.name} se ha exportado correctamente.`)
    } catch (error) {
      console.error('Export error:', error)
      alert('No se pudo exportar el PDF. Inténtalo de nuevo.')
    } finally {
      setIsExporting(false)
    }
  }, [cvData])

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.1, 2))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }, [])

  const handleZoomReset = useCallback(() => {
    setZoom(1)
  }, [])

  const handleCVDataChange = useCallback((newData) => {
    setCVData(newData)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CVEditorToolbar
        cvName={cvData.name}
        onCVNameChange={handleCVNameChange}
        onBack={onBack}
        onSave={handleSave}
        onExportPDF={handleExportPDF}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        isSaving={isSaving}
        isExporting={isExporting}
      />

      <div className="flex-1 overflow-hidden" ref={canvasRef}>
        <CVCanvas cvData={cvData} template={template} zoom={zoom} onCVDataChange={handleCVDataChange} />
      </div>

      {/* Loading overlays */}
      {(isSaving || isExporting) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3 min-w-64">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900">{isSaving ? "Guardando CV..." : "Exportando PDF..."}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default CVEditor
