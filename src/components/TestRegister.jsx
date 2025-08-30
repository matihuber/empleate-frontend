import React from 'react'

export default function TestRegister() {
  console.log("🔍 TestRegister ejecutándose!")
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          🎯 TEST REGISTER FUNCIONANDO!
        </h1>
        <p className="text-xl text-red-800">
          Si ves esto, el ruteo funciona correctamente
        </p>
        <div className="mt-8 p-4 bg-white rounded-lg">
          <p className="text-sm text-gray-600">
            Este es un componente de prueba para debuggear
          </p>
        </div>
      </div>
    </div>
  )
}
