import React, { useState } from 'react'
import { ArrowLeft, Save, FileText, ZoomIn, ZoomOut, Loader2, Edit3, Check, X } from 'lucide-react'

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
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section - Back Button */}
        <div className="flex items-center flex-shrink-0">
          <button
            onClick={onBack}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center"
            disabled={isSaving || isExporting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Volver</span>
          </button>
        </div>

        {/* Center Section - CV Name */}
        <div className="flex items-center justify-center flex-1 min-w-0">
          <div className="flex items-center">
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={handleNameKeyDown}
                  className="text-lg font-semibold text-gray-900 px-3 py-1 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  autoFocus
                  disabled={isSaving || isExporting}
                />
                <button
                  onClick={handleNameSubmit}
                  className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                  disabled={isSaving || isExporting}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setTempName(cvName)
                    setIsEditingName(false)
                  }}
                  className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  disabled={isSaving || isExporting}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 px-3 py-1 rounded-lg transition-all duration-200 hover:bg-blue-50 flex items-center group disabled:opacity-50"
                disabled={isSaving || isExporting}
              >
                {cvName}
                <Edit3 className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
            <button
              onClick={onZoomOut}
              className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 flex items-center justify-center"
              disabled={isSaving || isExporting}
              title="Alejar (Ctrl + -)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={onZoomReset}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-700 hover:bg-white rounded transition-colors min-w-[50px] sm:min-w-[65px] disabled:opacity-50 border border-gray-200"
              disabled={isSaving || isExporting}
              title="Zoom al 100% (Ctrl + 0)"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={onZoomIn}
              className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 flex items-center justify-center"
              disabled={isSaving || isExporting}
              title="Acercar (Ctrl + +)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Save Button */}
          <div className="relative group">
            <button
              onClick={onSave}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center shadow-sm hover:shadow-md cursor-pointer disabled:cursor-not-allowed"
              disabled={isSaving || isExporting}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
            </button>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
              {isSaving ? "Guardando..." : "Guardar (Ctrl + S)"}
            </div>
          </div>

          {/* Export PDF Button */}
          <div className="relative group">
            <button
              onClick={onExportPDF}
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center shadow-sm hover:shadow-md cursor-pointer disabled:cursor-not-allowed"
              disabled={isSaving || isExporting}
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
            </button>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
              {isExporting ? "Exportando..." : "Exportar PDF"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CVEditorToolbar
