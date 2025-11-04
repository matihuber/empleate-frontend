import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, ExternalLink, Star, RefreshCw, AlertCircle, CheckCircle, Settings } from 'lucide-react'
import courseRecommendationService from '../../services/courseRecommendationService'
import authService from '../../services/authService'
import { useSubscriptionRestrictions } from '../../hooks/useSubscriptionRestrictions'
import SubscriptionRestrictionModal from '../../components/SubscriptionRestrictionModal'
import DataRequiredModal from '../../components/DataRequiredModal'
import { useSubscription } from '../../contexts/SubscriptionContext'

export default function CourseRecommender() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [skillAnalysis, setSkillAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const [hasData, setHasData] = useState(false)
  const [progress, setProgress] = useState({ step: 0, message: '', percentage: 0 })
  const [showDataRequiredModal, setShowDataRequiredModal] = useState(false)

  // Hook para restricciones de suscripción
  const {
    executeWithSubscriptionCheck,
    isRestrictionModalOpen,
    restrictedFeature,
    setRestrictedFeature,
    setIsRestrictionModalOpen,
    closeRestrictionModal
  } = useSubscriptionRestrictions()

  // Hook para información de suscripción
  const { subscriptionInfo } = useSubscription()

  // Función para verificar si el usuario tiene datos previos
  const checkUserHasData = async () => {
    try {
      // Obtener el ID del usuario desde el token
      const userInfo = authService.getCurrentUser();
      if (!userInfo || !userInfo.sub) {
        return false;
      }

      // Usar el nuevo endpoint específico para verificar análisis
      const response = await authService.authenticatedRequest(`/my-data/has-analysis/${userInfo.sub}`);
      return response.has_analysis || false;
    } catch (error) {
      console.error('Error verificando análisis del usuario:', error);
      return false;
    }
  }

  useEffect(() => {
    // Cargar recomendaciones existentes si las hay
    loadExistingRecommendations()
  }, [])

  const loadExistingRecommendations = async () => {
    try {
      const recommendations = await courseRecommendationService.getMyRecommendations()
      if (recommendations && recommendations.length > 0) {
        setRecommendations(recommendations)
        setHasData(true)
      }
    } catch (error) {
      console.error('Error cargando recomendaciones existentes:', error)
      // No es un error crítico, simplemente no hay recomendaciones
    }
  }


  const generateRecommendations = async () => {
    // Verificar acceso usando información local de suscripción
    const canAccessCourseRecommendations = subscriptionInfo?.limits?.can_access_course_recommendations || false;
    
    if (!canAccessCourseRecommendations) {
      // Mostrar modal de restricción
      setRestrictedFeature('course_recommendations');
      setIsRestrictionModalOpen(true);
      return;
    }

    // Verificar si el usuario tiene datos previos (CV o LinkedIn analizado)
    const hasPreviousData = await checkUserHasData();
    
    if (!hasPreviousData) {
      // Mostrar modal de datos requeridos
      setShowDataRequiredModal(true);
      return;
    }

    // Proceder con la generación de recomendaciones
    setLoading(true)
    setError(null)
    setProgress({ step: 0, message: 'Iniciando análisis...', percentage: 0 })
    
    // Si ya hay cursos, limpiar la lista para mostrar que se están generando nuevos
    if (recommendations.length > 0) {
      setRecommendations([])
      setHasData(false)
    }
    
    try {
      // Simular progreso durante la generación (optimizado para ~20s)
      const progressSteps = [
        { step: 1, message: 'Analizando habilidades...', percentage: 25 },
        { step: 2, message: 'Buscando cursos...', percentage: 50 },
        { step: 3, message: 'Generando recomendaciones...', percentage: 75 },
        { step: 4, message: 'Finalizando...', percentage: 100 }
      ]

      // Actualizar progreso cada 5 segundos (optimizado para ~20s total)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const nextStep = prev.step + 1
          if (nextStep <= progressSteps.length) {
            return progressSteps[nextStep - 1]
          }
          return prev
        })
      }, 5000)

      const response = await courseRecommendationService.generateRecommendations()
      
      clearInterval(progressInterval)
      setProgress({ step: 5, message: '¡Recomendaciones generadas!', percentage: 100 })
      
      setRecommendations(response.recommendations || [])
      setSkillAnalysis(response.skill_analysis)
      setHasData(true)
    } catch (error) {
      console.error('Error generando recomendaciones:', error)

      // Manejar error de suscripción específicamente
      if (error.code === 'SUBSCRIPTION_REQUIRED' || error.status === 403) {
        setRestrictedFeature('course_recommendations');
        setIsRestrictionModalOpen(true);
      } else if (error.message && error.message.includes('No se encontraron datos del usuario')) {
        setError('NO_USER_DATA')
      } else if (error.message && error.message.includes('La respuesta del servidor no es JSON válido')) {
        // Probablemente sea un error de restricción que vino como HTML
        setRestrictedFeature('course_recommendations');
        setIsRestrictionModalOpen(true);
      } else {
        setError(error.message)
      }
    } finally {
      setLoading(false)
      setProgress({ step: 0, message: '', percentage: 0 })
    }
  }


  const openCourse = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Recomendador de cursos
              </h1>
              <p className="text-gray-600">
                Cursos personalizados basados en tu perfil profesional
              </p>
            </div>
            <button
              onClick={generateRecommendations}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-flex items-center text-sm"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Generando...' : 'Generar recomendaciones'}
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        {loading && progress.step > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {progress.message}
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                Paso {progress.step} de 4 - {progress.percentage}% completado
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && error !== 'SUBSCRIPTION_REQUIRED' && error !== 'NO_USER_DATA' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* No User Data Message */}
        {error === 'NO_USER_DATA' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Datos Requeridos
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Para recibir recomendaciones de cursos personalizadas, primero necesitas cargar tu CV y/o tu perfil de LinkedIn en la sección "Mis Datos".
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6 max-w-md mx-auto border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">¿Cómo funciona?</h4>
                <ul className="text-gray-600 text-left space-y-2">
                  <li>• Analizamos tus habilidades actuales</li>
                  <li>• Identificamos brechas de conocimiento</li>
                  <li>• Buscamos cursos actualizados en plataformas reconocidas</li>
                  <li>• Te recomendamos hasta 3 cursos personalizados</li>
                </ul>
              </div>
              
              <button
                onClick={() => navigate('/user-home?section=mis-datos')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Ir a Mis Datos
              </button>
            </div>
          </div>
        )}

        {/* Subscription Required Message */}
        {error === 'SUBSCRIPTION_REQUIRED' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Funcionalidad Premium
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                La funcionalidad de recomendaciones de cursos no está disponible en el plan Básico. 
                Actualiza tu suscripción para acceder a recomendaciones personalizadas de cursos 
                basadas en tu perfil profesional.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6 max-w-md mx-auto border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Planes disponibles:</h4>
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Plan Plus</span>
                    <span className="text-green-600 font-semibold">5 requests/mes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Plan Pro</span>
                    <span className="text-green-600 font-semibold">Ilimitado</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/user-home?section=configuracion')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center"
              >
                <Settings className="w-5 h-5 mr-2" />
                Actualizar Suscripción
              </button>
            </div>
          </div>
        )}

        {/* Skill Analysis */}
        {skillAnalysis && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Análisis de tu perfil</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Objetivo profesional</h3>
                <p className="text-gray-600">
                  {skillAnalysis.target_role || 'No especificado'}
                </p>
                {!skillAnalysis.target_role && (
                  <p className="text-sm text-gray-500 mt-1">
                    Configura tu objetivo profesional en la sección "Configuración" para obtener recomendaciones más precisas
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Debilidades identificadas</h3>
                <div className="flex flex-wrap gap-2">
                  {skillAnalysis.skill_gaps?.slice(0, 3).map((gap, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                    >
                      {gap.skill}
                    </span>
                  ))}
                </div>
                {skillAnalysis.career_recommendations && (
                  <div className="mt-3">
                    <h4 className="font-medium text-gray-700 mb-1">Recomendaciones de carrera</h4>
                    <p className="text-sm text-gray-600">{skillAnalysis.career_recommendations}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


        {/* Recommendations */}
        {recommendations.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Cursos recomendados ({recommendations.length})
            </h2>
            
            {recommendations.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                index={index}
                onOpenCourse={openCourse}
              />
            ))}
          </div>
        ) : !loading && error !== 'SUBSCRIPTION_REQUIRED' && error !== 'NO_USER_DATA' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay recomendaciones disponibles
            </h3>
            <p className="text-gray-500 mb-6">
              Haz clic en "Generar recomendaciones" para obtener cursos personalizados
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <RefreshCw className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Generando recomendaciones...
            </h3>
            <p className="text-gray-500">
              Esto puede tomar unos momentos mientras analizamos tu perfil
            </p>
          </div>
        )}
      </div>

      {/* Modal de restricción de suscripción */}
      <SubscriptionRestrictionModal
        isOpen={isRestrictionModalOpen}
        onClose={closeRestrictionModal}
        feature={restrictedFeature}
        title="Funcionalidad no disponible"
        showUpgradeButton={true}
      />

      {/* Modal de datos requeridos */}
      <DataRequiredModal
        isOpen={showDataRequiredModal}
        onClose={() => setShowDataRequiredModal(false)}
        title="Datos profesionales requeridos"
        message="Para generar recomendaciones de cursos personalizados, necesitas subir un CV inicial o importar tu perfil de LinkedIn para que podamos analizar tu experiencia profesional. Dirígete a la sección 'Mis Datos' para subir tu información."
      />
    </div>
  )
}

function CourseCard({ course, index, onOpenCourse }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {index + 1}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${courseRecommendationService.getPlatformColor(course.platform)}`}>
                {course.platform_display_name}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {course.title}
            </h3>
            
            {course.description && (
              <p className="text-gray-600 mb-4 line-clamp-2">
                {course.description}
              </p>
            )}
          </div>
        </div>

        {/* Course Stats */}
        <div className="flex gap-4 mb-4">
          {course.rating && (
            <div className="flex items-center text-gray-600">
              <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{course.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Skill Gap Addressed */}
        <div className="mb-4">
          <span className="text-sm text-gray-500">Aborda: </span>
          <span className="text-sm font-medium text-orange-600">
            {course.skill_gap_addressed}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
          </button>
          
          <button
            onClick={() => onOpenCourse(course.course_url)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 inline-flex items-center"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Ir al curso
          </button>
        </div>

        {/* Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {course.reasoning && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">¿Por qué este curso?</h4>
                <p className="text-gray-600 text-sm">{course.reasoning}</p>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {course.skill_level && (
                <div>
                  <span className="font-medium text-gray-700">Nivel: </span>
                  <span className="text-gray-600">
                    {courseRecommendationService.formatSkillLevel(course.skill_level)}
                  </span>
                </div>
              )}
              
              <div>
                <span className="font-medium text-gray-700">Relevancia: </span>
                <span className="text-gray-600">
                  {Math.round(course.relevance_score * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
