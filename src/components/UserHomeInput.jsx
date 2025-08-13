import { useState } from "react"
import { Edit, Check, X } from "lucide-react"

export default function UserHomeInput({ 
  value, 
  type = "text", 
  onChange, 
  placeholder,
  showEditIcon = true,
  className = ""
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentValue, setCurrentValue] = useState(value)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    if (onChange) {
      onChange(currentValue)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setCurrentValue(value) // Restaurar valor original
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    
      <div className="relative">
        <input
          type={type}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          disabled={!isEditing}
          className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl drop-shadow-md transition-all duration-200 pr-12 ${
            isEditing 
              ? 'text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
              : 'text-gray-400 cursor-default'
          }`}
        />
        
        {/* Botones de acción */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {!isEditing && showEditIcon ? (
            <button
              onClick={handleEdit}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <Edit className="w-4 h-4" />
            </button>
          ) : isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="text-green-600 hover:text-green-700 transition-colors p-1"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="text-red-600 hover:text-red-700 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : null}
        </div>
      </div>
  )
}