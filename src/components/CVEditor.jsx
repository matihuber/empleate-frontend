import React, { useState, useCallback, useRef, useEffect } from 'react'
import CVEditorToolbar from './CVEditorToolbar'
import CVCanvas from './CVCanvas'
import PDFExportModal from './PDFExportModal'
import { getTemplateStyles } from '../lib/templates'

const CVEditor = ({ initialCVData, selectedTemplate, onBack, onSave, onExport }) => {
  const [cvData, setCVData] = useState(initialCVData)
  const [zoom, setZoom] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [pdfModal, setPdfModal] = useState({ isOpen: false, status: 'idle', message: '', progress: 0 })
  const canvasRef = useRef(null)

  const template = getTemplateStyles(selectedTemplate)

  const handleCVNameChange = useCallback((name) => {
    setCVData((prev) => ({ ...prev, name }))
  }, [])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      console.log('🔍 CVEditor: handleSave llamado')
      console.log('🔍 CVEditor: cvData:', cvData)
      console.log('🔍 CVEditor: onSave prop:', onSave)
      
      if (onSave) {
        console.log('🔍 CVEditor: Llamando a onSave prop...')
        await onSave(cvData)
        console.log('✅ CVEditor: onSave completado')
      } else {
        console.log('⚠️ CVEditor: No hay onSave prop, usando fallback')
        // Fallback: Save to localStorage
        localStorage.setItem('cvData', JSON.stringify(cvData))
        alert(`${cvData.name} se ha guardado correctamente.`)
      }
    } catch (error) {
      console.error('❌ CVEditor: Error en handleSave:', error)
      alert('No se pudo guardar el CV. Inténtalo de nuevo.')
    } finally {
      setIsSaving(false)
    }
  }, [cvData, onSave])

  const handleExportPDF = useCallback(async () => {
    if (!canvasRef.current) {
      setPdfModal({ isOpen: true, status: 'error', message: 'No se pudo encontrar el contenido del CV para exportar.', progress: 0 })
      return
    }

    setIsExporting(true)
    
    // Abrir modal de loading
    setPdfModal({ isOpen: true, status: 'loading', message: 'Generando tu CV en formato PDF...', progress: 0 })
    
    try {
      console.log('🔍 CVEditor: handleExportPDF llamado')
      console.log('🔍 CVEditor: cvData:', cvData)
      console.log('🔍 CVEditor: onExport prop:', onExport)
      
      if (onExport) {
        console.log('🔍 CVEditor: Llamando a onExport prop...')
        
        // Crear función de progreso
        const onProgress = (progress) => {
          setPdfModal(prev => ({ ...prev, progress }))
        }
        
        await onExport(cvData, onProgress)
        console.log('✅ CVEditor: onExport completado')
        
        // Mostrar éxito
        setPdfModal({ isOpen: true, status: 'success', message: '¡Tu CV se ha exportado exitosamente!', progress: 100 })
      } else {
        console.log('⚠️ CVEditor: No hay onExport prop, usando fallback')
        // Fallback: Just show a success message
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setPdfModal({ isOpen: true, status: 'success', message: `${cvData.name} se ha exportado correctamente.`, progress: 100 })
      }
    } catch (error) {
      console.error('❌ CVEditor: Error en handleExportPDF:', error)
      setPdfModal({ isOpen: true, status: 'error', message: 'No se pudo exportar el PDF. Inténtalo de nuevo.', progress: 0 })
    } finally {
      setIsExporting(false)
    }
  }, [cvData, onExport])

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => {
      const newZoom = prev + 0.1
      return Math.min(newZoom, 2.0) // Máximo 200%
    })
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => {
      const newZoom = prev - 0.1
      return Math.max(newZoom, 0.3) // Mínimo 30%
    })
  }, [])

  const handleZoomReset = useCallback(() => {
    setZoom(1.0) // Exactamente 100%
  }, [])

  // Atajos de teclado para zoom y guardar
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + S para guardar
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      // Ctrl/Cmd + Plus para zoom in
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault()
        handleZoomIn()
      }
      // Ctrl/Cmd + Minus para zoom out
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault()
        handleZoomOut()
      }
      // Ctrl/Cmd + 0 para reset zoom
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault()
        handleZoomReset()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleSave, handleZoomIn, handleZoomOut, handleZoomReset])

  const handleCVDataChange = useCallback((newData) => {
    setCVData(newData)
  }, [])

  const closePdfModal = useCallback(() => {
    setPdfModal({ isOpen: false, status: 'idle', message: '', progress: 0 })
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
        <CVCanvas 
          cvData={cvData} 
          template={template} 
          zoom={zoom} 
          onCVDataChange={handleCVDataChange}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
      </div>

      {/* Loading overlay for saving */}
      {isSaving && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop que cubre toda la pantalla */}
          <div className="absolute inset-0 backdrop-brightness-30 transition-opacity" />
          
          {/* Modal centrado */}
          <div className="relative h-full flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3 min-w-64 shadow-2xl">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-900">Guardando CV...</span>
            </div>
          </div>
        </div>
      )}

      {/* PDF Export Modal */}
      <PDFExportModal
        isOpen={pdfModal.isOpen}
        onClose={closePdfModal}
        status={pdfModal.status}
        message={pdfModal.message}
        progress={pdfModal.progress}
      />
    </div>
  )
}

export default CVEditor
