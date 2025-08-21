import { Mail, Phone, MapPin, Linkedin, Globe, Star, Award, Calendar } from 'lucide-react'

// Template CV Profesional - Estilo con Sidebar
export default function CVTemplate1({ cvData }) {
  // Si no hay datos, mostrar template con datos de ejemplo
  const data = cvData || {
    personalInfo: {
      name: "ANA MARÍA FERNÁNDEZ",
      title: "Java Programmer | Project Management | Business Tech",
      email: "ana@fernandez.com",
      phone: "+34 123 456 678",
      location: "León, México",
      linkedin: "linkedin.com",
      website: "anafernandez.com",
      avatar: null,
      age: "35 años"
    },
    summary: "Apasionada desarrolladora de Java con más de 8 años de experiencia en desarrollo de aplicaciones y tecnologías web, con operación en funciones directas. Lider para la integración de sistemas y desarrollo de proyectos anteriores.",
    experience: [
      {
        position: "Java Developer Senior",
        company: "Everis",
        location: "Madrid, Spain",
        period: "01/2020 - Presente",
        achievements: [
          "Lidero un equipo de 5 desarrolladores en un proyecto público, logrando un ahorro del 20% en costos operativos.",
          "Implementé microservicios con tecnologías REST y SOAP, mejorando la eficiencia del sistema en un 15%.",
          "Desarrollé mejoras del Snail y SQL para automatización de procesos, aumentando la productividad individual y del equipo en un 25%.",
          "Colaboré con equipos internacionales en la integración de sistemas, alcanzando una compatibilidad del 95% con plataformas existentes.",
          "Optimicé queries de base de datos, reduciendo significativamente el tiempo de actividad del 98,9%."
        ]
      },
      {
        position: "Java Developer",
        company: "Everis",
        location: "Sevilla, Spain", 
        period: "06/2017 - 12/2019",
        achievements: [
          "Desarrollé componentes reutilizables en Struts, logrando una reducción del 40% en tiempos de desarrollo futuro.",
          "Implementé servicios web con XML mejorando la comunicación entre sistemas en un 30%.",
          "Colaboré en proyectos de migración de datos SQL a Oracle, mejorando la eficiencia y seguridad de los datos.",
          "Optimicé consultas en PL/SQL, reduciendo los tiempos de respuesta de aplicaciones críticas en un 30%."
        ]
      },
      {
        position: "Junior Java Developer",
        company: "DXC Technology",
        location: "México City, México",
        period: "02/2015 - 05/2017",
        achievements: [
          "Desarrollé funcionalidades en J2EE para aplicaciones de negocio, mejorando la experiencia del usuario.",
          "Asistí en la implementación de servicios web SOAP para clientes principales.",
          "Participé en la integración de sistemas en un centro de distribución, optimizando el tiempo de ejecución manual en un 30%."
        ]
      }
    ],
    education: [
      {
        degree: "Master en Informática",
        institution: "Universidad Politécnica de Madrid",
        location: "Madrid, Spain",
        period: "01/2013 - 01/2015"
      },
      {
        degree: "Grado en Ciencias de la Computación",
        institution: "Universidad de Guanajuato",
        location: "Guanajuato, México", 
        period: "01/2009 - 01/2013"
      }
    ],
    skills: {
      technical: [
        { name: "Java", level: 5 },
        { name: "J2EE", level: 5 },
        { name: "Struts", level: 4 },
        { name: "WebServices (SOAP/REST)", level: 4 },
        { name: "SQL/PL-SQL", level: 4 },
        { name: "Shell Scripting", level: 3 }
      ],
      languages: [
        { name: "Español", level: "Nativo" },
        { name: "Inglés", level: "Competente" }
      ]
    },
    achievements: [
      {
        title: "Líder en equipo de proyecto público",
        description: "Lideré con éxito un ahorro del 20% en costos operativos mediante la optimización de procesos."
      },
      {
        title: "Mejora en eficiencia del sistema",
        description: "Desarrollé servicios web microservicios logrando una mejora en la eficiencia del sistema de un 15% en más."
      },
      {
        title: "Automatización de procesos",
        description: "Desarrollé scripts que redujeron el tiempo manual de tareas, mejorando la productividad."
      },
      {
        title: "Capacitación para desarrolladores",
        description: "Generé nuevos miembros en tecnologías clave, aumentando la productividad en un 30% en promedio."
      }
    ],
    certifications: [
      {
        name: "Oracle Certified Professional Java SE",
        issuer: "Oracle",
        date: "2019"
      },
      {
        name: "AWS Cloud Practitioner",
        issuer: "Amazon Web Services",
        date: "2020"
      }
    ]
  }

  const renderStars = (level) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < level ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const renderLanguageLevel = (level) => {
    const dots = level === "Nativo" ? 5 : level === "Competente" ? 4 : 3
    return Array.from({ length: 5 }, (_, index) => (
      <div
        key={index}
        className={`w-2 h-2 rounded-full ${
          index < dots ? 'bg-white' : 'bg-slate-600'
        }`}
      />
    ))
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl">
      <div className="flex min-h-screen">
        {/* Sidebar izquierdo */}
        <div className="w-1/3 bg-slate-700 text-white p-6">
          {/* Foto de perfil */}
          <div className="text-center mb-6">
            <div className="w-32 h-32 mx-auto bg-slate-600 rounded-full flex items-center justify-center mb-4 overflow-hidden">
              {data.personalInfo.avatar ? (
                <img 
                  src={data.personalInfo.avatar} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-slate-300">
                    {data.personalInfo.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Perfil Profesional */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-center">PERFIL PROFESIONAL</h3>
            <p className="text-sm leading-relaxed text-slate-200">
              {data.summary}
            </p>
          </div>

          {/* Logros Clave */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">LOGROS CLAVE</h3>
            <div className="space-y-4">
              {data.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{achievement.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Habilidades */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">HABILIDADES</h3>
            <div className="space-y-3">
              {data.skills.technical.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{skill.name}</span>
                  </div>
                  <div className="flex space-x-1">
                    {renderStars(skill.level)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Idiomas */}
          <div>
            <h3 className="text-lg font-bold mb-4">IDIOMAS</h3>
            <div className="space-y-3">
              {data.skills.languages.map((language, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{language.name}</span>
                    <span className="text-xs text-slate-300">{language.level}</span>
                  </div>
                  <div className="flex space-x-1">
                    {renderLanguageLevel(language.level)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="w-2/3 p-8">
          {/* Header con información personal */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {data.personalInfo.name}
            </h1>
            <p className="text-lg text-blue-600 mb-4">
              {data.personalInfo.title}
            </p>
            
            {/* Información de contacto */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{data.personalInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{data.personalInfo.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Linkedin className="w-4 h-4" />
                <span>{data.personalInfo.linkedin}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{data.personalInfo.location}</span>
              </div>
              {data.personalInfo.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>{data.personalInfo.website}</span>
                </div>
              )}
              {data.personalInfo.age && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{data.personalInfo.age}</span>
                </div>
              )}
            </div>
          </div>

          {/* Experiencia */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
              EXPERIENCIA
            </h2>
            <div className="space-y-6">
              {data.experience.map((job, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {job.position}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {job.company}
                      </p>
                      {job.location && (
                        <p className="text-sm text-gray-500">{job.location}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {job.period}
                    </span>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {job.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} className="flex items-start space-x-2">
                        <span className="text-blue-600 mt-2">•</span>
                        <span className="leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Educación */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
              EDUCACIÓN
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {edu.degree}
                    </h3>
                    <p className="text-blue-600 font-medium">{edu.institution}</p>
                    {edu.location && (
                      <p className="text-sm text-gray-500">{edu.location}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {edu.period}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Certificaciones */}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                CERTIFICACIONES
              </h2>
              <div className="space-y-3">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                      <p className="text-blue-600 text-sm">{cert.issuer}</p>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {cert.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}