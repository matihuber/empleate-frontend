import { useState, useRef, useCallback } from 'react'
import { X, Upload, RotateCcw, } from 'lucide-react'

export default function AvatarCropModal({ isOpen, onClose, onSave, currentAvatar }) {
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [cropSettings, setCropSettings] = useState({
    x: 50,
    y: 50,
    zoom: 1,
    rotation: 0
  })
  const [activeTab, setActiveTab] = useState('cortar')
  const [isDragging, setIsDragging] = useState(false)
  const [useForCV, setUseForCV] = useState(true)
  
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)

  // Manejar selección de archivo
  const handleFileSelect = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(file)
        setImageUrl(e.target.result)
        // Resetear configuraciones
        setCropSettings({ x: 50, y: 50, zoom: 1, rotation: 0 })
      }
      reader.readAsDataURL(file)
    }
  }, [])

  // Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  // Manejar input de archivo
  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // Funciones de crop
  const handleZoomChange = (e) => {
    setCropSettings(prev => ({ ...prev, zoom: parseFloat(e.target.value) }))
  }

  const handleRotationChange = (e) => {
    setCropSettings(prev => ({ ...prev, rotation: parseFloat(e.target.value) }))
  }

  // Guardar imagen editada
  const handleSave = () => {
    if (!imageUrl) return
    
    // Aquí implementarías la lógica real de crop
    // Por ahora simulamos guardando la URL original
    onSave({
      imageUrl: imageUrl,
      useForCV: useForCV,
      cropSettings: cropSettings
    })
    
    // Resetear estado
    setImage(null)
    setImageUrl(null)
    setCropSettings({ x: 50, y: 50, zoom: 1, rotation: 0 })
    onClose()
  }

  const handleClose = () => {
    setImage(null)
    setImageUrl(null)
    setCropSettings({ x: 50, y: 50, zoom: 1, rotation: 0 })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Cambiar imagen</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Área de imagen/upload */}
            <div className="space-y-4">
              {!imageUrl ? (
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-gray-50 hover:border-blue-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Arrastra una imagen hasta aquí o{' '}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                      súbela
                    </button>
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="bg-gray-100 rounded-2xl p-4 min-h-[300px] flex items-center justify-center">
                  {/* Vista previa con crop circular */}
                  <div className="relative">
                    <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        style={{
                          transform: `
                            scale(${cropSettings.zoom}) 
                            rotate(${cropSettings.rotation}deg)
                            translate(${(50 - cropSettings.x)}%, ${(50 - cropSettings.y)}%)
                          `,
                          transformOrigin: 'center center'
                        }}
                      />
                    </div>
                    {/* Botón para cambiar imagen */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 w-10 h-10 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors"
                      title="Cambiar imagen"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Panel de controles */}
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('cortar')}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    activeTab === 'cortar'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cortar
                </button>
                <button
                  onClick={() => setActiveTab('ajustar')}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    activeTab === 'ajustar'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Ajustar
                </button>
              </div>

              {/* Controles según tab activo */}
              {imageUrl && (
                <div className="space-y-6">
                  {activeTab === 'cortar' && (
                    <div className="space-y-4">
                      {/* Zoom */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Zoom
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="3"
                          step="0.1"
                          value={cropSettings.zoom}
                          onChange={handleZoomChange}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>

                      {/* Posición horizontal */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Posición horizontal
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={cropSettings.x}
                          onChange={(e) => setCropSettings(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>

                      {/* Posición vertical */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Posición vertical
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={cropSettings.y}
                          onChange={(e) => setCropSettings(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'ajustar' && (
                    <div className="space-y-4">
                      {/* Enderezar */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enderezar
                        </label>
                        <input
                          type="range"
                          min="-45"
                          max="45"
                          step="1"
                          value={cropSettings.rotation}
                          onChange={handleRotationChange}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="text-center text-sm text-gray-500 mt-1">
                          {cropSettings.rotation}°
                        </div>
                      </div>

                      {/* Botones de rotación rápida */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCropSettings(prev => ({ ...prev, rotation: prev.rotation - 90 }))}
                          className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          90° izq.
                        </button>
                        <button
                          onClick={() => setCropSettings(prev => ({ ...prev, rotation: prev.rotation + 90 }))}
                          className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <RotateCcw className="w-4 h-4 mr-2 scale-x-[-1]" />
                          90° der.
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Checkbox para usar en CV */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="useForCV"
                  checked={useForCV}
                  onChange={(e) => setUseForCV(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="useForCV" className="text-sm font-medium text-gray-700">
                  Usar la foto para generar el CV
                </label>
              </div>

              {/* Botón guardar */}
              <button
                onClick={handleSave}
                disabled={!imageUrl}
                className={`w-full py-3 px-6 rounded-2xl font-medium transition-all ${
                  imageUrl
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Guardar foto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}