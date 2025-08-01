export default function CardHome({ src, alt, number, className = "", onError }) {  
  return (
    <div className={`relative group ${className}`}>
      {/* Card container con borde blanco estilo polaroid */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-3xl p-3 `}
      >
        {/* Contenedor de la imagen con bordes redondeados internos */}
        <div className="relative rounded-xl overflow-hidden bg-gray-100">
          <img
            src={src || "/placeholder.svg"}
            alt={alt}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-102"
            onError={onError}
          />

          {/* Overlay sutil para hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Brillo sutil en hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Sombra de profundidad */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-2xl -z-10 transform translate-x-2 translate-y-2 transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3`}
      ></div>

      {/* Sombra adicional para más profundidad */}
      <div className="absolute inset-0 bg-gray-200/10 rounded-2xl -z-20 transform translate-x-1 translate-y-1"></div>
    </div>
  )
}

