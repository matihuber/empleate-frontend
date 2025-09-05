import { useEffect, useState, useRef } from "react"
import { Facebook, Instagram, Twitter } from "lucide-react"
import CardHome from "../../components/CardHome"
import Navigation from "../../components/Navigation"

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0)
  const totalSections = 4
  const isScrolling = useRef(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault()
      }

      if (!isScrolling.current) {
        if (e.key === "ArrowDown" && currentSection < totalSections - 1) {
          isScrolling.current = true
          setCurrentSection((prev) => prev + 1)
          setTimeout(() => {
            isScrolling.current = false
          }, 1000)
        } else if (e.key === "ArrowUp" && currentSection > 0) {
          isScrolling.current = true
          setCurrentSection((prev) => prev - 1)
          setTimeout(() => {
            isScrolling.current = false
          }, 100)
        }
      }
    }

    const handleWheel = (e) => {
      e.preventDefault()

      if (!isScrolling.current) {
        if (e.deltaY > 0 && currentSection < totalSections - 1) {
          isScrolling.current = true
          setCurrentSection((prev) => prev + 1)
          setTimeout(() => {
            isScrolling.current = false
          }, 1000)
        } else if (e.deltaY < 0 && currentSection > 0) {
          isScrolling.current = true
          setCurrentSection((prev) => prev - 1)
          setTimeout(() => {
            isScrolling.current = false
          }, 100)
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("wheel", handleWheel, { passive: false })
    document.body.tabIndex = -1
    document.body.focus()

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("wheel", handleWheel)
    }
  }, [currentSection])

  useEffect(() => {
    const sectionElement = document.getElementById(`section-${currentSection}`)
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" })
    }
  }, [currentSection])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Component */}
      <Navigation />
        
      {/* Section 1 */}
      <section
        id="section-0"
        className="h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: `
            linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%),
            radial-gradient(circle at 20% 80%, #ddd6fe 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #fecaca 0%, transparent 50%)
          `,
        }}
      >
        <div className="text-center z-10 px-6 max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-800 mb-8 leading-[0.9] tracking-tight">
            Impulsá tu carrera
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              con inteligencia artificial
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Transforma tu perfil profesional con herramientas de IA que te ayudan a destacar en el mercado laboral
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer">
            Nuestra misión
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-600/70 rounded-full flex justify-center backdrop-blur-sm bg-white/10">
            <div className="w-1 h-3 bg-gray-600 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-600 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Section 2: CV Generator */}
      <section
        id="section-1"
        className="min-h-screen flex items-center py-20"
        style={{
          background: `
            linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%),
            radial-gradient(circle at 20% 80%, #ddd6fe 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #fecaca 0%, transparent 50%)
          `,
        }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 leading-[0.9] tracking-tight">
                  Creá un CV
                  <br />
                  <span className="text-blue-600">optimizado</span> en
                  <br />
                  segundos
                </h2>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
                Nuestro generador con inteligencia artificial transforma tu perfil en un CV listo para destacar ante los
                sistemas ATS.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                  Crear mi CV
                </button>
                <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer">
                  Ver ejemplo
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <CardHome
                src="/images/cv_home.png"
                alt="CV Generator"
                number="1"
                className="w-full max-w-sm lg:max-w-md xl:max-w-lg"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/500x400/3b82f6/ffffff?text=CV+Generator"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Salary Calculator */}
      <section
        id="section-2"
        className="min-h-screen flex items-center py-20"
        style={{
          background: `
            linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%),
            radial-gradient(circle at 20% 80%, #ddd6fe 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #fecaca 0%, transparent 50%)
          `,
        }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-5 order-1 lg:order-1 flex justify-center lg:justify-start">
              <CardHome
                src="/images/sueldo_home.png"
                alt="Salary Calculator"
                number="2"
                className="w-full max-w-sm lg:max-w-md xl:max-w-lg"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/500x400/10b981/ffffff?text=Salary+Calculator"
                }}
              />
            </div>

            <div className="lg:col-span-7 order-2 lg:order-2 space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 leading-[0.9] tracking-tight">
                  ¿Cuánto podrías
                  <br />
                  <span className="text-emerald-600">ganar?</span>
                </h2>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
                Descubrí el salario promedio en tu industria, región y nivel de experiencia con nuestra calculadora
                inteligente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
                  Calcular salario
                </button>
                <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer">
                  Ver estadísticas
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Courses + Footer */}
      <section
        id="section-3"
        className="min-h-screen flex flex-col"
        style={{
          background: `
            linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%),
            radial-gradient(circle at 20% 80%, #ddd6fe 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #fecaca 0%, transparent 50%)
          `,
        }}
      >
        {/* Courses Content */}
        <div className="flex-1 flex items-center py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 leading-[0.9] tracking-tight">
                    Aprende con
                    <br />
                    los <span className="text-purple-600">cursos</span>
                    <br />
                    recomendados
                  </h2>
                </div>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
                  Haz crecer tu carrera con cursos personalizados para tu perfil según las tendencias del mercado y
                  demanda laboral.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                    Ver cursos
                  </button>
                  <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer">
                    Mi plan de estudio
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <CardHome
                  src="/images/cursos_home.png"
                  alt="Recommended Courses"
                  number="3"
                  className="w-full max-w-sm lg:max-w-md xl:max-w-lg"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/500x400/8b5cf6/ffffff?text=Online+Courses"
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer integrado en la última sección */}
        <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <img
                    src="/images/logo.png"
                    alt="Empleate Logo"
                    className="w-6 h-6"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%232563eb'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ctext x='12' y='16' textAnchor='middle' fill='white' fontSize='12'%3Ee%3C/text%3E%3C/svg%3E"
                    }}
                  />
                  <span className="text-xl font-semibold text-blue-600">Empleate</span>
                </div>
                <div className="flex space-x-4">
                  <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer" />
                  <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-600 cursor-pointer" />
                  <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Condiciones y políticas del sitio</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <a href="#" className="hover:text-blue-600">
                      Términos y condiciones
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-600">
                      Política de privacidad
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-600">
                      Política de cookies
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Acerca de nosotros</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <a href="#" className="hover:text-blue-600">
                      Nuestra historia
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-600">
                      Equipo
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-600">
                      Trabaja con nosotros
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Soporte</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <a href="#" className="hover:text-blue-600">
                      FAQ / Ayuda
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-600">
                      Contacto
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-600">
                      empleate@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </section>

      {/* Indicador de secciones */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-3">
        {[0, 1, 2, 3].map((index) => (
          <button
            key={index}
            onClick={() => {
              if (!isScrolling.current) {
                isScrolling.current = true;
                setCurrentSection(index);
                sectionsRef.current[index]?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
                setTimeout(() => {
                  isScrolling.current = false;
                }, 100);
              }
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSection === index 
                ? 'bg-blue-600 scale-125' 
                : 'bg-blue-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
