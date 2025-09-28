import authService from './authService'

class PDFExportService {
  constructor() {
    // Forzar la URL correcta ya que la variable de entorno está mal configurada
    this.baseURL = 'http://localhost:8000/api/v1'
  }

  /**
   * Exportar CV a PDF usando el backend
   */
  async exportToPDF(cvData, cvName, templateId, onProgress = null) {
    try {
      const url = `${this.baseURL}/cv/export/pdf`
      const token = authService.accessToken
      
      console.log('🔍 PDFExportService: Exportando CV a PDF...')
      console.log('🔍 PDFExportService: Nombre:', cvName)
      console.log('🔍 PDFExportService: Template:', templateId)
      
      // Simular progreso inicial
      if (onProgress) onProgress(10)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: cvName,
          template_id: templateId,
          content_json: cvData
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Simular progreso
      if (onProgress) onProgress(30)

      // El backend devuelve HTML, lo convertimos a PDF usando html2canvas + jsPDF
      const htmlContent = await response.text()
      
      // Simular progreso
      if (onProgress) onProgress(50)
      
      // Crear un elemento temporal para renderizar el HTML
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = htmlContent
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.top = '-9999px'
      tempDiv.style.width = '210mm' // A4 width
      tempDiv.style.backgroundColor = 'white'
      document.body.appendChild(tempDiv)
      
      // Simular progreso
      if (onProgress) onProgress(70)

      // Importar librerías dinámicamente
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      
      // Simular progreso
      if (onProgress) onProgress(80)
      
      // Convertir a canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      const imgData = canvas.toDataURL('image/png')
      
      // Crear PDF con configuración mejorada
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16
      })
      
      // Agregar metadatos completos al PDF
      const fileName = (cvName || 'CV').replace(/[^a-zA-Z0-9\-_]/g, '_')
      const currentDate = new Date()
      
      pdf.setProperties({
        title: fileName,
        subject: 'Curriculum Vitae generado por Empleate',
        author: 'Empleate',
        creator: 'Empleate',
        producer: 'Empleate PDF Service',
        creationDate: currentDate,
        modDate: currentDate,
        keywords: 'CV, curriculum vitae, empleo, trabajo, profesional'
      })
      
      // Agregar información adicional del archivo
      pdf.setFileId(`empleate-cv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
      
      // Agregar texto invisible para mejorar la extracción de contenido
      pdf.setFontSize(1)
      pdf.setTextColor(255, 255, 255) // Texto blanco (invisible)
      pdf.text(`CV: ${fileName}`, 1, 1)
      pdf.text(`Generado: ${currentDate.toISOString()}`, 1, 2)
      pdf.text(`Plantilla: ${templateId}`, 1, 3)
      
      // Si hay datos del CV, agregar como texto invisible
      if (cvData && typeof cvData === 'object') {
        const cvText = this.extractTextFromCVData(cvData)
        if (cvText) {
          pdf.setFontSize(0.1)
          const lines = pdf.splitTextToSize(cvText, 200)
          lines.slice(0, 50).forEach((line, index) => {
            pdf.text(line, 1, 4 + (index * 0.1))
          })
        }
      }
      
      // Agregar contenido visual
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      
      let position = 0
      
      // Agregar imagen al PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pageHeight
      
      // Agregar páginas adicionales si es necesario
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
        heightLeft -= pageHeight
      }
      
      // Simular progreso
      if (onProgress) onProgress(95)

      // Limpiar elemento temporal
      document.body.removeChild(tempDiv)
      
      // Descargar PDF con nombre válido
      const sanitizedFileName = fileName.replace(/[<>:"/\\|?*]/g, '_')
      pdf.save(`${sanitizedFileName}.pdf`)
      
      // Progreso completado
      if (onProgress) onProgress(100)
      
      console.log('✅ PDFExportService: PDF exportado exitosamente')
      return true
      
    } catch (error) {
      console.error('❌ PDFExportService: Error exportando PDF:', error)
      throw error
    }
  }

  /**
   * Extraer texto de los datos del CV para mejorar la búsqueda
   */
  extractTextFromCVData(cvData) {
    try {
      let text = ''
      
      // === INFORMACIÓN PERSONAL ===
      if (cvData.personalInfo) {
        const info = cvData.personalInfo
        text += '=== INFORMACIÓN PERSONAL ===\n'
        if (info.name) text += `Nombre: ${info.name}\n`
        if (info.email) text += `Email: ${info.email}\n`
        if (info.phone) text += `Teléfono: ${info.phone}\n`
        if (info.location) text += `Ubicación: ${info.location}\n`
        text += '\n'
      }
      
      // === RESUMEN PROFESIONAL ===
      if (cvData.summary) {
        text += '=== RESUMEN PROFESIONAL ===\n'
        text += `${cvData.summary}\n\n`
      }
      
      // === EXPERIENCIA LABORAL ===
      if (cvData.experience && Array.isArray(cvData.experience) && cvData.experience.length > 0) {
        text += '=== EXPERIENCIA LABORAL ===\n'
        cvData.experience.forEach((exp, index) => {
          text += `--- Experiencia ${index + 1} ---\n`
          if (exp.position) text += `Posición: ${exp.position}\n`
          if (exp.company) text += `Empresa: ${exp.company}\n`
          if (exp.startDate) text += `Fecha de inicio: ${exp.startDate}\n`
          if (exp.endDate) {
            text += `Fecha de finalización: ${exp.endDate}\n`
          } else if (exp.current) {
            text += `Fecha de finalización: Presente\n`
          }
          if (exp.description && exp.description.trim() && !exp.description.includes('Descripción del cargo...')) {
            text += `Descripción: ${exp.description}\n`
          }
          text += '\n'
        })
      }
      
      // === EDUCACIÓN ===
      if (cvData.education && Array.isArray(cvData.education) && cvData.education.length > 0) {
        text += '=== EDUCACIÓN ===\n'
        cvData.education.forEach((edu, index) => {
          text += `--- Educación ${index + 1} ---\n`
          if (edu.institution) text += `Institución: ${edu.institution}\n`
          if (edu.degree) text += `Título: ${edu.degree}\n`
          if (edu.startDate) text += `Fecha de comienzo: ${edu.startDate}\n`
          if (edu.endDate) {
            text += `Fecha de finalización: ${edu.endDate}\n`
          } else if (edu.current) {
            text += `Fecha de finalización: Presente\n`
          }
          text += '\n'
        })
      }
      
      // === HABILIDADES ===
      if (cvData.skills && Array.isArray(cvData.skills) && cvData.skills.length > 0) {
        text += '=== HABILIDADES ===\n'
        cvData.skills.forEach((skill, index) => {
          if (typeof skill === 'string') {
            text += `• ${skill}\n`
          } else if (skill.name) {
            text += `• ${skill.name}`
            if (skill.level) text += ` (${skill.level})`
            text += '\n'
          }
        })
        text += '\n'
      }
      
      // === IDIOMAS ===
      if (cvData.languages && Array.isArray(cvData.languages) && cvData.languages.length > 0) {
        text += '=== IDIOMAS ===\n'
        cvData.languages.forEach((lang, index) => {
          text += `• ${lang.language || lang.name || lang}`
          if (lang.level) text += ` (${lang.level})`
          text += '\n'
        })
        text += '\n'
      }
      
      // === CERTIFICACIONES ===
      if (cvData.certifications && Array.isArray(cvData.certifications) && cvData.certifications.length > 0) {
        text += '=== CERTIFICACIONES ===\n'
        cvData.certifications.forEach((cert, index) => {
          text += `--- Certificación ${index + 1} ---\n`
          if (cert.title) text += `Título: ${cert.title}\n`
          if (cert.issuer) text += `Emisor: ${cert.issuer}\n`
          if (cert.date) text += `Fecha: ${cert.date}\n`
          text += '\n'
        })
      }
      
      return text.trim()
    } catch (error) {
      console.warn('Error extrayendo texto del CV:', error)
      return ''
    }
  }

  /**
   * Agregar contenido del CV al PDF usando texto directo
   */
  async addCVContentToPDF(pdf, htmlElement, cvData) {
    const pageWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const margin = 15 // Margen en mm
    const lineHeight = 4 // Altura de línea en mm
    let currentY = margin
    
    // Función para agregar texto con salto de línea automático
    const addText = (text, fontSize = 10, isBold = false, color = '#000000') => {
      if (!text) return
      
      pdf.setFontSize(fontSize)
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
      pdf.setTextColor(color)
      
      // Dividir texto en líneas que caben en la página
      const maxWidth = pageWidth - (margin * 2)
      const lines = pdf.splitTextToSize(text, maxWidth)
      
      for (const line of lines) {
        if (currentY + lineHeight > pageHeight - margin) {
          pdf.addPage()
          currentY = margin
        }
        
        pdf.text(line, margin, currentY)
        currentY += lineHeight
      }
    }
    
    // Función para agregar título de sección
    const addSectionTitle = (title) => {
      currentY += 3 // Espacio antes del título
      addText(title, 12, true, '#3b82f6')
      currentY += 2 // Espacio después del título
    }
    
    // Header
    const header = htmlElement.querySelector('.header')
    if (header) {
      const name = header.querySelector('.name')?.textContent || ''
      const title = header.querySelector('.title')?.textContent || ''
      const contact = header.querySelector('.contact')?.textContent || ''
      
      addText(name, 16, true)
      addText(title, 11, false, '#64748b')
      addText(contact, 9, false, '#64748b')
      currentY += 5 // Espacio después del header
    }
    
    // Secciones
    const sections = htmlElement.querySelectorAll('.section')
    sections.forEach(section => {
      const sectionTitle = section.querySelector('.section-title')?.textContent || ''
      if (sectionTitle) {
        addSectionTitle(sectionTitle)
      }
      
      // Items de experiencia/educación
      const items = section.querySelectorAll('.experience-item, .education-item')
      items.forEach(item => {
        const itemTitle = item.querySelector('.item-title')?.textContent || ''
        const itemCompany = item.querySelector('.item-company')?.textContent || ''
        const itemDate = item.querySelector('.item-date')?.textContent || ''
        const itemDescription = item.querySelector('p')?.textContent || ''
        
        if (itemTitle) {
          addText(itemTitle, 11, true)
        }
        if (itemCompany) {
          addText(itemCompany, 10, false, '#64748b')
        }
        if (itemDate) {
          addText(itemDate, 9, false, '#64748b')
        }
        if (itemDescription) {
          addText(itemDescription, 10, false)
        }
        currentY += 2 // Espacio entre items
      })
      
      // Skills
      const skillsColumns = section.querySelector('.skills-columns')
      if (skillsColumns) {
        const skillItems = section.querySelectorAll('.skill-item')
        const skillsText = Array.from(skillItems).map(item => item.textContent).join(' | ')
        addText(skillsText, 10, false)
      }
    })
  }

  /**
   * Exportar CV a PDF usando html2canvas + jsPDF (fallback)
   */
  async exportToPDFFallback(cvData, cvName) {
    try {
      console.log('🔍 PDFExportService: Usando fallback para exportar PDF...')
      
      // Importar librerías dinámicamente
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      
      // Obtener el elemento del CV
      const cvElement = document.querySelector('.cv-editor-canvas')
      if (!cvElement) {
        throw new Error('No se encontró el elemento del CV para exportar')
      }
      
      // Convertir a canvas
      const canvas = await html2canvas(cvElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      // Crear PDF con configuración mejorada
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16
      })
      
      // Agregar metadatos y contenido textual similar al método principal
      const fileName = (cvName || 'CV').replace(/[^a-zA-Z0-9\-_]/g, '_')
      const currentDate = new Date()
      
      pdf.setProperties({
        title: fileName,
        subject: 'Curriculum Vitae',
        author: 'Empleate',
        creator: 'Empleate CV Generator',
        producer: 'Empleate PDF Service',
        creationDate: currentDate,
        modDate: currentDate,
        keywords: 'CV, curriculum, vitae, empleo, trabajo'
      })
      
      // Agregar texto invisible para extracción
      pdf.setFontSize(1)
      pdf.setTextColor(255, 255, 255)
      pdf.text(`CV: ${fileName}`, 1, 1)
      pdf.text(`Generado: ${currentDate.toISOString()}`, 1, 2)
      
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      
      let position = 0
      
      // Agregar imagen al PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pageHeight
      
      // Agregar páginas adicionales si es necesario
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
        heightLeft -= pageHeight
      }
      
      // Descargar PDF
      const sanitizedFileName = fileName.replace(/[<>:"/\\|?*]/g, '_')
      pdf.save(`${sanitizedFileName}.pdf`)
      
      console.log('✅ PDFExportService: PDF exportado con fallback exitosamente')
      return true
      
    } catch (error) {
      console.error('❌ PDFExportService: Error en fallback:', error)
      throw error
    }
  }

  /**
   * Crear PDF híbrido con texto searchable
   */
  async createSearchablePDF(cvData, cvName, htmlElement) {
    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      
      // Convertir HTML a canvas
      const canvas = await html2canvas(htmlElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      // Crear PDF
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16
      })
      
      // Metadatos completos
      const fileName = (cvName || 'CV').replace(/[^a-zA-Z0-9\-_]/g, '_')
      pdf.setProperties({
        title: fileName,
        subject: 'Curriculum Vitae',
        author: 'Empleate',
        creator: 'Empleate CV Generator',
        producer: 'Empleate PDF Service',
        creationDate: new Date(),
        keywords: 'CV, curriculum, empleo, trabajo'
      })
      
      // Primero agregar el contenido textual invisible
      await this.addCVContentToPDF(pdf, htmlElement, cvData)
      
      // Luego agregar la imagen visual encima
      const imgData = canvas.toDataURL('image/png')
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST')
      
      return pdf
    } catch (error) {
      console.error('Error creando PDF searchable:', error)
      throw error
    }
  }
}

export const pdfExportService = new PDFExportService()