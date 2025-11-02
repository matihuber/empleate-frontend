import { X } from 'lucide-react'

const TermsAndConditions = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Términos y Condiciones</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Última actualización: Octubre 2025
            </p>
            <p className="text-gray-700">
              Bienvenido a Empleate. Al acceder y utilizar nuestra plataforma, aceptas estar sujeto a los siguientes términos y condiciones. Por favor, léelos cuidadosamente antes de utilizar nuestros servicios.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">1. Aceptación de los Términos</h3>
            <p className="text-gray-700">
              Al registrarte y utilizar Empleate, confirmas que has leído, comprendido y aceptado estos Términos y Condiciones, así como nuestra Política de Privacidad. Si no estás de acuerdo con alguno de estos términos, no debes utilizar nuestros servicios.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">2. Descripción del Servicio</h3>
            <p className="text-gray-700 mb-2">
              Empleate es una plataforma que ofrece las siguientes funcionalidades:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Generación de currículums profesionales mediante inteligencia artificial</li>
              <li>Importación y análisis de perfiles profesionales de LinkedIn</li>
              <li>Optimización de CVs para sistemas de seguimiento de candidatos (ATS)</li>
              <li>Estimación salarial basada en perfil profesional y mercado laboral</li>
              <li>Recomendaciones personalizadas de cursos y capacitaciones</li>
              <li>Acceso a múltiples plantillas de CV profesionales</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">3. Registro y Cuenta de Usuario</h3>
            <p className="text-gray-700 mb-2">
              Para utilizar Empleate, debes crear una cuenta proporcionando información precisa y actualizada. Eres responsable de:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Mantener la confidencialidad de tus credenciales de acceso</li>
              <li>Todas las actividades que ocurran bajo tu cuenta</li>
              <li>Notificarnos inmediatamente ante cualquier uso no autorizado</li>
              <li>Proporcionar información veraz y actualizada</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">4. Planes y Suscripciones</h3>
            <p className="text-gray-700 mb-2">
              Empleate ofrece tres tipos de planes:
            </p>
            <div className="ml-4 space-y-2">
              <div>
                <p className="font-semibold text-gray-800">Plan Gratuito:</p>
                <p className="text-gray-700">Acceso limitado con generación de un CV único y funcionalidades básicas.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Plan Pro ($6.99/mes):</p>
                <p className="text-gray-700">Generación de hasta 5 CVs mensuales con análisis profesional y optimización ATS.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Plan Premium ($11.99/mes):</p>
                <p className="text-gray-700">Generación de hasta 100 CVs mensuales con todas las funcionalidades, incluyendo estimación salarial y recomendaciones de cursos.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">5. Pagos y Facturación</h3>
            <p className="text-gray-700 mb-2">
              Al suscribirte a un plan de pago:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Los pagos se procesan de forma segura a través de procesadores de pago certificados</li>
              <li>Las suscripciones se renuevan automáticamente cada mes</li>
              <li>Los precios están expresados en dólares estadounidenses (USD)</li>
              <li>Puedes cancelar tu suscripción en cualquier momento desde la configuración de tu cuenta</li>
              <li>No se realizan reembolsos por períodos parciales una vez iniciado el ciclo de facturación</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">6. Uso Aceptable</h3>
            <p className="text-gray-700 mb-2">
              Al utilizar Empleate, te comprometes a:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>No utilizar el servicio para fines ilegales o no autorizados</li>
              <li>No cargar contenido falso, engañoso o que infrinja derechos de terceros</li>
              <li>No intentar acceder a áreas no autorizadas del sistema</li>
              <li>No reproducir, duplicar o copiar cualquier parte del servicio sin autorización</li>
              <li>No realizar ingeniería inversa de la plataforma</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">7. Propiedad Intelectual</h3>
            <p className="text-gray-700">
              Todo el contenido, diseño, código, marcas comerciales y otros elementos de Empleate son propiedad exclusiva de la empresa. Los currículums generados son propiedad del usuario, quien mantiene todos los derechos sobre su contenido personal y profesional.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">8. Privacidad y Protección de Datos</h3>
            <p className="text-gray-700">
              El uso de tus datos personales está regulado por nuestra Política de Privacidad. Nos comprometemos a proteger tu información y cumplir con las regulaciones de protección de datos aplicables. Al utilizar Empleate, consientes el procesamiento de tus datos según lo descrito en nuestra política.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">9. Modificaciones del Servicio</h3>
            <p className="text-gray-700">
              Empleate se reserva el derecho de modificar, suspender o descontinuar cualquier aspecto del servicio en cualquier momento, con o sin previo aviso. No seremos responsables ante ti o terceros por cualquier modificación, suspensión o descontinuación del servicio.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">10. Limitación de Responsabilidad</h3>
            <p className="text-gray-700">
              Empleate proporciona el servicio "tal cual" y "según disponibilidad". No garantizamos que el servicio será ininterrumpido, seguro o libre de errores. En ningún caso seremos responsables por daños indirectos, incidentales, especiales o consecuentes derivados del uso o la imposibilidad de usar el servicio.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">11. Rescisión</h3>
            <p className="text-gray-700">
              Podemos suspender o cancelar tu cuenta si violas estos términos o por cualquier otra razón que consideremos apropiada. Puedes cancelar tu cuenta en cualquier momento desde la configuración. La cancelación no te exime de las obligaciones de pago ya contraídas.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">12. Ley Aplicable</h3>
            <p className="text-gray-700">
              Estos términos se regirán e interpretarán de acuerdo con las leyes aplicables, sin dar efecto a ningún principio de conflictos de leyes. Cualquier disputa relacionada con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales competentes.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">13. Modificaciones de los Términos</h3>
            <p className="text-gray-700">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre cambios significativos a través de la plataforma o por correo electrónico. El uso continuado del servicio después de dichas modificaciones constituye tu aceptación de los nuevos términos.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">14. Contacto</h3>
            <p className="text-gray-700">
              Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos a través de:
            </p>
            <ul className="list-none text-gray-700 space-y-1 ml-4 mt-2">
              <li>Email: soporte@empleate.work</li>
              <li>Sección de soporte en la plataforma</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Al continuar usando Empleate, reconoces que has leído y aceptado estos Términos y Condiciones en su totalidad.
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

export default TermsAndConditions