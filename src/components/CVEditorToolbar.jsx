import React, { useState } from 'react'
import { ArrowLeft, Save, FileText, ZoomIn, ZoomOut, Loader2 } from 'lucide-react'

const CVEditorToolbar = ({
  cvName,
  onCVNameChange,
  onBack,
  onSave,
  onExportPDF,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  isSaving = false,
  isExporting = false,
}) => {
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(cvName)

  const handleNameSubmit = () => {
    onCVNameChange(tempName)
    setIsEditingName(false)
  }

  const handleNameKeyDown = (e) => {
    if (e.key === "Enter") {
      handleNameSubmit()
    } else if (e.key === "Escape") {
      setTempName(cvName)
      setIsEditingName(false)
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left Section - Back Button */}
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
            disabled={isSaving || isExporting}
          >
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            Volver
          </button>
        </div>

        {/* Center Section - Title and CV Name */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">Editor de CV</h1>
          <div className="flex items-center">
            {isEditingName ? (
              <input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={handleNameKeyDown}
                className="w-48 h-8 text-sm px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                disabled={isSaving || isExporting}
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                disabled={isSaving || isExporting}
              >
                {cvName}
              </button>
            )}
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-3">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={onZoomOut}
              className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
              disabled={isSaving || isExporting}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={onZoomReset}
              className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-white rounded transition-colors min-w-[60px] disabled:opacity-50"
              disabled={isSaving || isExporting}
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={onZoomIn}
              className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
              disabled={isSaving || isExporting}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={onSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50 flex items-center"
            disabled={isSaving || isExporting}
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? "Guardando..." : "Guardar"}
          </button>

          {/* Export PDF Button */}
          <button
            onClick={onExportPDF}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50 flex items-center"
            disabled={isSaving || isExporting}
          >
            {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
            {isExporting ? "Exportando..." : "Exportar PDF"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CVEditorToolbar
