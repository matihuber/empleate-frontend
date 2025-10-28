import { X } from 'lucide-react'

const PrivacyPolicy = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Política de Privacidad</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Última actualización: Octubre 2025
            </p>
            <p className="text-gray-700">
              En Empleate, nos tomamos muy en serio la privacidad de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos tu información personal cuando utilizas nuestra plataforma.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">1. Información que Recopilamos</h3>
            
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-800 mb-2">1.1 Información que nos proporcionas directamente:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Datos de registro: nombre, correo electrónico, contraseña</li>
                  <li>Información profesional: experiencia laboral, educación, habilidades</li>
                  <li>Datos de perfil de LinkedIn cuando autorizas la importación</li>
                  <li>Preferencias de búsqueda laboral y ubicación geográfica</li>
                  <li>Información de pago para suscripciones (procesada por terceros certificados)</li>
                  <li>Comunicaciones con nuestro equipo de soporte</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-800 mb-2">1.2 Información recopilada automáticamente:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Datos de uso de la plataforma (páginas visitadas, funciones utilizadas)</li>
                  <li>Información del dispositivo (tipo, sistema operativo, navegador)</li>
                  <li>Dirección IP y datos de ubicación aproximada</li>
                  <li>Cookies y tecnologías similares para mejorar tu experiencia</li>
                  <li>Registros de actividad y métricas de rendimiento</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">2. Cómo Usamos tu Información</h3>
            <p className="text-gray-700 mb-2">
              Utilizamos la información recopilada para los siguientes propósitos:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Proporcionar y mejorar nuestros servicios de generación de CV</li>
              <li>Personalizar tu experiencia en la plataforma</li>
              <li>Analizar y optimizar tu perfil profesional</li>
              <li>Generar recomendaciones personalizadas de cursos y capacitaciones</li>
              <li>Calcular estimaciones salariales basadas en tu perfil y mercado</li>
              <li>Procesar pagos y gestionar suscripciones</li>
              <li>Comunicarnos contigo sobre actualizaciones y novedades del servicio</li>
              <li>Detectar y prevenir fraudes o uso indebido de la plataforma</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
              <li>Realizar análisis estadísticos y mejorar nuestros algoritmos de IA</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">3. Base Legal para el Procesamiento de Datos</h3>
            <p className="text-gray-700 mb-2">
              Procesamos tus datos personales bajo las siguientes bases legales:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li><span className="font-semibold">Consentimiento:</span> cuando nos autorizas explícitamente a procesar tu información</li>
              <li><span className="font-semibold">Ejecución de contrato:</span> para proporcionarte los servicios que has solicitado</li>
              <li><span className="font-semibold">Interés legítimo:</span> para mejorar nuestros servicios y prevenir fraudes</li>
              <li><span className="font-semibold">Obligación legal:</span> cuando la ley nos requiere procesar cierta información</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">4. Compartir Información con Terceros</h3>
            <p className="text-gray-700 mb-2">
              No vendemos tu información personal. Podemos compartir tu información en las siguientes circunstancias:
            </p>
            
            <div className="space-y-3 ml-4">
              <div>
                <p className="font-semibold text-gray-800">Proveedores de servicios:</p>
                <p className="text-gray-700">Empresas que nos ayudan a operar la plataforma (hosting, procesamiento de pagos, análisis de datos), bajo estrictos acuerdos de confidencialidad.</p>
              </div>

              <div>
                <p className="font-semibold text-gray-800">Servicios de IA:</p>
                <p className="text-gray-700">Utilizamos servicios de inteligencia artificial para generar y optimizar CVs, siempre respetando tu privacidad.</p>
              </div>

              <div>
                <p className="font-semibold text-gray-800">Cumplimiento legal:</p>
                <p className="text-gray-700">Cuando sea requerido por ley, orden judicial o autoridades competentes.</p>
              </div>

              <div>
                <p className="font-semibold text-gray-800">Transferencias empresariales:</p>
                <p className="text-gray-700">En caso de fusión, adquisición o venta de activos, tu información podría ser transferida.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">5. Seguridad de tu Información</h3>
            <p className="text-gray-700 mb-2">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Encriptación de datos en tránsito y en reposo</li>
              <li>Controles de acceso estrictos a información personal</li>
              <li>Monitoreo continuo de seguridad y auditorías regulares</li>
              <li>Protocolos de respuesta ante incidentes de seguridad</li>
              <li>Cumplimiento con estándares de seguridad de la industria</li>
            </ul>
            <p className="text-gray-700 mt-2">
              Sin embargo, ningún sistema es completamente seguro. Te recomendamos usar contraseñas fuertes y no compartir tus credenciales.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">6. Retención de Datos</h3>
            <p className="text-gray-700">
              Conservamos tu información personal solo durante el tiempo necesario para cumplir con los propósitos descritos en esta política, a menos que la ley requiera o permita un período de retención más largo. Cuando eliminas tu cuenta, procedemos a eliminar o anonimizar tus datos personales, excepto aquellos que debamos conservar por obligaciones legales.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">7. Tus Derechos</h3>
            <p className="text-gray-700 mb-2">
              Tienes los siguientes derechos sobre tu información personal:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li><span className="font-semibold">Acceso:</span> solicitar una copia de la información que tenemos sobre ti</li>
              <li><span className="font-semibold">Rectificación:</span> corregir información inexacta o incompleta</li>
              <li><span className="font-semibold">Eliminación:</span> solicitar la eliminación de tu información personal</li>
              <li><span className="font-semibold">Portabilidad:</span> recibir tus datos en un formato estructurado y legible</li>
              <li><span className="font-semibold">Oposición:</span> oponerte al procesamiento de tus datos en ciertos casos</li>
              <li><span className="font-semibold">Limitación:</span> solicitar la restricción del procesamiento de tus datos</li>
              <li><span className="font-semibold">Retirar consentimiento:</span> en cualquier momento, sin afectar la legalidad del procesamiento previo</li>
            </ul>
            <p className="text-gray-700 mt-2">
              Para ejercer estos derechos, contáctanos a través de soporte@empleate.com
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">8. Cookies y Tecnologías Similares</h3>
            <p className="text-gray-700 mb-2">
              Utilizamos cookies y tecnologías similares para:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Mantener tu sesión activa</li>
              <li>Recordar tus preferencias</li>
              <li>Analizar el uso de la plataforma</li>
              <li>Personalizar tu experiencia</li>
              <li>Mejorar la seguridad</li>
            </ul>
            <p className="text-gray-700 mt-2">
              Puedes gestionar las preferencias de cookies desde la configuración de tu navegador, aunque algunas funcionalidades pueden verse afectadas.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">9. Privacidad de Menores</h3>
            <p className="text-gray-700">
              Empleate no está dirigido a menores de 18 años. No recopilamos intencionalmente información de menores. Si descubrimos que hemos recopilado información de un menor sin consentimiento parental, tomaremos medidas para eliminar dicha información inmediatamente.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">10. Transferencias Internacionales de Datos</h3>
            <p className="text-gray-700">
              Tu información puede ser transferida y almacenada en servidores ubicados fuera de tu país de residencia. En estos casos, implementamos medidas de protección adecuadas, como cláusulas contractuales estándar aprobadas, para garantizar que tus datos reciban un nivel de protección equivalente.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">11. Cambios en esta Política</h3>
            <p className="text-gray-700">
              Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos sobre cambios significativos a través de la plataforma o por correo electrónico. La fecha de "Última actualización" al inicio de este documento indica cuándo se realizó la última revisión. Te recomendamos revisar esta política regularmente.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">12. Contacto</h3>
            <p className="text-gray-700 mb-2">
              Si tienes preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad o el manejo de tu información personal, puedes contactarnos:
            </p>
            <ul className="list-none text-gray-700 space-y-1 ml-4">
              <li><span className="font-semibold">Email:</span> soporte@empleate.com</li>
              <li><span className="font-semibold">Email de privacidad:</span> privacidad@empleate.com</li>
              <li><span className="font-semibold">Sección de soporte:</span> disponible en la plataforma</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Al utilizar Empleate, confirmas que has leído y comprendido esta Política de Privacidad y consientes el procesamiento de tu información personal según lo descrito aquí.
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

export default PrivacyPolicy