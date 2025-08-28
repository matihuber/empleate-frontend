import { useState } from 'react'
import { X, Upload } from 'lucide-react'

export default function LinkedInImportModal({ isOpen, onClose, onSave }) {
  const [uploadedFile, setUploadedFile] = useState(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.name.endsWith('.zip')) {
      setUploadedFile(file)
    }
  }

  const handleFileDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.name.endsWith('.zip')) {
      setUploadedFile(file)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleSave = () => {
    if (uploadedFile) {
      onSave(uploadedFile)
      setUploadedFile(null)
      onClose()
    }
  }

  const handleClose = () => {
    setUploadedFile(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h2 className="text-2xl font-bold text-gray-800">Importar perfil de LinkedIn</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Pasos para obtener el archivo */}
          <div className="mb-8 space-y-4">
            <div>
              <p className="text-gray-800 font-medium">
                <span className="font-bold">Paso 1:</span> Entra a LinkedIn y dirígete al perfil
              </p>
            </div>

            <div>
              <p className="text-gray-800 font-medium">
                <span className="font-bold">Paso 2:</span> Ve a Ajustes → <span className="underline text-blue-600">Gestiona tu cuenta y la privacidad</span>
              </p>
            </div>

            <div>
              <p className="text-gray-800 font-medium">
                <span className="font-bold">Paso 3:</span> En el panel izquierdo de Ajustes, seleccionar "Privacidad de datos"
              </p>
            </div>

            <div>
              <p className="text-gray-800 font-medium">
                <span className="font-bold">Paso 4:</span> Dentro de la sección "Cómo utiliza LinkedIn tus datos", seleccionar "Obtener una copia de tus datos"
              </p>
            </div>

            <div>
              <p className="text-gray-800 font-medium">
                <span className="font-bold">Paso 5:</span> Tildar la casilla del "Perfil"
              </p>
            </div>

            <div>
              <p className="text-gray-800 font-medium">
                <span className="font-bold">Paso 6:</span> Hacer click en "Solicitar archivo"
              </p>
              <p className="text-sm text-gray-600 italic mt-1">
                *El archivo estará disponible a los 10 minutos de haberlo solicitado, subir el archivo .ZIP obtenido*
              </p>
            </div>
          </div>

          {/* Área de drag & drop */}
          <div className="mb-6">
            <div
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50"
            >
              <label htmlFor="linkedin-file-upload" className="cursor-pointer block">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                {!uploadedFile ? (
                  <p className="text-gray-600">
                    Arrastra un archivo hasta aquí o{" "}
                    <span className="text-blue-600 hover:text-blue-700 font-medium underline">
                      súbelo
                    </span>
                  </p>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                    <span className="text-gray-800 font-medium">{uploadedFile.name}</span>
                  </div>
                )}
              </label>
              <input
                type="file"
                accept=".zip"
                onChange={handleFileUpload}
                className="hidden"
                id="linkedin-file-upload"
              />
            </div>
          </div>

          {/* Botón guardar */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={!uploadedFile}
              className={`px-8 py-3 rounded-2xl font-medium transition-all ${
                uploadedFile
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Guardar perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}