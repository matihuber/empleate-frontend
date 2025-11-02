import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const FAQs = ({ isOpen, onClose }) => {
  const [openQuestion, setOpenQuestion] = useState(null)

  const faqs = [
    {
      id: 1,
      category: "General",
      question: "¿Qué es Empleate?",
      answer: "Empleate es una plataforma inteligente que te ayuda a crear currículums profesionales optimizados mediante inteligencia artificial. Analizamos tu perfil profesional, optimizamos tu CV para superar filtros ATS (Applicant Tracking Systems) y te proporcionamos herramientas adicionales como estimación salarial y recomendaciones de cursos personalizadas."
    },
    {
      id: 2,
      category: "General",
      question: "¿Cómo funciona Empleate?",
      answer: "Simplemente carga tu CV actual o importa tu perfil de LinkedIn. Nuestra IA analiza tu información profesional, la optimiza y genera un currículum profesional adaptado a tus necesidades. Puedes elegir entre diferentes plantillas, editar el contenido y descargar tu CV listo para enviar."
    },
    {
      id: 3,
      category: "Planes y Precios",
      question: "¿Qué incluye el plan Gratuito?",
      answer: "El plan Gratuito te permite generar 1 CV único con acceso a una plantilla básica. Es ideal para probar la plataforma, pero no incluye análisis del perfil de LinkedIn, optimización ATS, estimación salarial ni recomendaciones de cursos."
    },
    {
      id: 4,
      category: "Planes y Precios",
      question: "¿Cuál es la diferencia entre el plan Pro y Premium?",
      answer: "El plan Pro ($6.99/mes) te permite crear hasta 5 CVs por mes con análisis de perfil y optimización ATS, y acceso a todas las plantillas. El plan Premium ($11.99/mes) incluye todo lo del plan Pro más generación de hasta 100 CVs mensuales, estimación salarial y recomendaciones de cursos personalizadas según la demanda del mercado."
    },
    {
      id: 5,
      category: "Planes y Precios",
      question: "¿Puedo cancelar mi suscripción en cualquier momento?",
      answer: "Sí, puedes cancelar tu suscripción en cualquier momento desde la sección de Configuración. Al cancelar, mantendrás acceso a las funcionalidades de tu plan hasta el final del período de facturación actual. No se realizan reembolsos por períodos parciales."
    },
    {
      id: 6,
      category: "Planes y Precios",
      question: "¿Ofrecen descuentos o planes anuales?",
      answer: "Actualmente ofrecemos suscripciones mensuales. Mantente atento a nuestras promociones y ofertas especiales que anunciamos periódicamente a través de la plataforma y por correo electrónico."
    },
    {
      id: 7,
      category: "Funcionalidades",
      question: "¿Qué es la optimización ATS?",
      answer: "Los sistemas ATS (Applicant Tracking Systems) son software que muchas empresas usan para filtrar CVs automáticamente. Nuestra optimización ATS asegura que tu currículum tenga el formato, palabras clave y estructura correctos para superar estos filtros y llegar a manos de reclutadores humanos."
    },
    {
      id: 8,
      category: "Funcionalidades",
      question: "¿Cómo funciona el análisis del perfil de LinkedIn?",
      answer: "Cuando importas tu perfil de LinkedIn, nuestra IA analiza tu experiencia laboral, educación, habilidades y logros. Identifica fortalezas, áreas de mejora y optimiza la presentación de tu información para hacerla más atractiva para los reclutadores."
    },
    {
      id: 9,
      category: "Funcionalidades",
      question: "¿Cómo se calcula la estimación salarial?",
      answer: "La estimación salarial (disponible en el plan Premium) se basa en múltiples factores: tu experiencia, educación, habilidades, ubicación geográfica, industria y datos actuales del mercado laboral. Utilizamos algoritmos de IA que analizan miles de datos para proporcionarte una estimación precisa."
    },
    {
      id: 10,
      category: "Funcionalidades",
      question: "¿Puedo editar mi CV después de generarlo?",
      answer: "¡Por supuesto! Todos los CVs generados son completamente editables. Puedes modificar cualquier sección, cambiar el formato, ajustar el contenido y personalizar tu currículum según tus necesidades específicas."
    },
    {
      id: 11,
      category: "Funcionalidades",
      question: "¿Cuántas plantillas de CV están disponibles?",
      answer: "El plan Gratuito incluye 1 plantilla básica. Los planes Pro y Premium tienen acceso a todas nuestras plantillas profesionales, que incluyen diseños modernos, clásicos y creativos adaptados a diferentes industrias y perfiles profesionales."
    },
    {
      id: 12,
      category: "Cuenta y Seguridad",
      question: "¿Es segura mi información personal?",
      answer: "Sí, tomamos muy en serio la seguridad de tus datos. Utilizamos encriptación de última generación, cumplimos con las regulaciones de protección de datos y nunca vendemos tu información a terceros. Lee nuestra Política de Privacidad para más detalles."
    },
    {
      id: 13,
      category: "Cuenta y Seguridad",
      question: "¿Puedo cambiar mi correo electrónico o contraseña?",
      answer: "Sí, puedes actualizar tu correo electrónico y contraseña en cualquier momento desde la sección de 'Mis Datos' en tu perfil. Te recomendamos usar contraseñas fuertes y únicas para mantener tu cuenta segura."
    },
    {
      id: 14,
      category: "Cuenta y Seguridad",
      question: "¿Qué sucede si elimino mi cuenta?",
      answer: "Al eliminar tu cuenta, se eliminará permanentemente toda tu información personal y los CVs que hayas creado. Esta acción no se puede deshacer. Si tienes una suscripción activa, asegúrate de cancelarla antes de eliminar tu cuenta."
    },
    {
      id: 15,
      category: "Técnicas",
      question: "¿En qué formato puedo descargar mi CV?",
      answer: "Actualmente puedes descargar tu CV en formato PDF, que es el formato más aceptado y recomendado por reclutadores y sistemas ATS. Próximamente agregaremos más opciones de formato."
    },
    {
      id: 16,
      category: "Técnicas",
      question: "¿Empleate funciona en dispositivos móviles?",
      answer: "Sí, Empleate está optimizado para funcionar en computadoras de escritorio, tablets y smartphones. Puedes acceder a todas las funcionalidades desde cualquier dispositivo con conexión a internet."
    },
    {
      id: 17,
      category: "Técnicas",
      question: "¿Necesito instalar algún software?",
      answer: "No, Empleate es una plataforma web 100% online. Solo necesitas un navegador moderno (Chrome, Firefox, Safari, Edge) y conexión a internet para acceder a todos los servicios."
    },
    {
      id: 18,
      category: "Soporte",
      question: "¿Cómo puedo contactar al equipo de soporte?",
      answer: "Puedes contactarnos a través del botón 'Reportar un problema' en la sección de Configuración, o enviarnos un correo a soporte@empleate.work. Nuestro equipo responde en un plazo máximo de 24-48 horas."
    },
    {
      id: 19,
      category: "Soporte",
      question: "¿Ofrecen tutoriales o guías de uso?",
      answer: "Sí, en nuestra plataforma encontrarás guías interactivas y tooltips que te ayudarán a aprovechar al máximo todas las funcionalidades. También publicamos regularmente consejos y mejores prácticas en nuestro blog."
    },
    {
      id: 20,
      category: "Soporte",
      question: "¿Qué hago si encuentro un error en la plataforma?",
      answer: "Si encuentras algún error o comportamiento inesperado, por favor repórtalo usando el botón 'Reportar un problema' en Configuración. Describe el problema con el mayor detalle posible para que podamos solucionarlo rápidamente."
    }
  ]

  const categories = [...new Set(faqs.map(faq => faq.category))]

  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Preguntas Frecuentes (FAQs)</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {categories.map((category) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-4">{category}</h3>
              <div className="space-y-3">
                {faqs
                  .filter(faq => faq.category === category)
                  .map((faq) => (
                    <div
                      key={faq.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(faq.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <span className="font-medium text-gray-800 pr-4">
                          {faq.question}
                        </span>
                        {openQuestion === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {openQuestion === faq.id && (
                        <div className="px-4 pb-4 text-gray-700 border-t border-gray-100">
                          <p className="pt-3">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}

          <div className="bg-blue-50 p-4 rounded-lg mt-6">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">¿No encontraste lo que buscabas?</span> Contáctanos a través de soporte@empleate.work o usa el botón "Reportar un problema" en la sección de Configuración.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default FAQs