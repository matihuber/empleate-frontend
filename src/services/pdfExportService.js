import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

class PDFExportService {
  constructor() {
    this.pdf = null
    this.canvas = null
  }

  // Exportar CV a PDF
  async exportCVToPDF(sections, template, filename = 'CV_Exportado.pdf') {
    try {
      console.log('Iniciando exportación a PDF...')
      
      // Crear un contenedor temporal para renderizar el CV
      const container = this.createTemporaryContainer(sections, template)
      document.body.appendChild(container)
      
      // Convertir a canvas
      this.canvas = await html2canvas(container, {
        scale: 2, // Mejor calidad
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: container.offsetWidth,
        height: container.offsetHeight
      })
      
      // Limpiar contenedor temporal
      document.body.removeChild(container)
      
      // Generar PDF
      await this.generatePDF(filename)
      
      console.log('PDF exportado exitosamente')
      return true
      
    } catch (error) {
      console.error('Error exportando a PDF:', error)
      throw error
    }
  }

  // Crear contenedor temporal para renderizar
  createTemporaryContainer(sections, template) {
    const container = document.createElement('div')
    container.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 800px;
      background: white;
      padding: 40px;
      font-family: Arial, sans-serif;
      color: #1f2937;
    `
    
    // Aplicar estilos del template
    const templateStyles = this.getTemplateStyles(template)
    
    // Renderizar cada sección
    sections.forEach(section => {
      const sectionElement = this.renderSection(section, templateStyles)
      container.appendChild(sectionElement)
    })
    
    return container
  }

  // Renderizar una sección individual
  renderSection(section, templateStyles) {
    const sectionDiv = document.createElement('div')
    sectionDiv.style.cssText = `
      margin-bottom: 20px;
      page-break-inside: avoid;
    `
    
    switch (section.type) {
      case 'header':
        sectionDiv.innerHTML = this.renderHeader(section, templateStyles)
        break
      case 'summary':
        sectionDiv.innerHTML = this.renderSummary(section, templateStyles)
        break
      case 'experience':
        sectionDiv.innerHTML = this.renderExperience(section, templateStyles)
        break
      case 'skills':
        sectionDiv.innerHTML = this.renderSkills(section, templateStyles)
        break
      case 'education':
        sectionDiv.innerHTML = this.renderEducation(section, templateStyles)
        break
      case 'certifications':
        sectionDiv.innerHTML = this.renderCertifications(section, templateStyles)
        break
      case 'languages':
        sectionDiv.innerHTML = this.renderLanguages(section, templateStyles)
        break
      default:
        sectionDiv.innerHTML = `<p>Sección no reconocida: ${section.type}</p>`
    }
    
    return sectionDiv
  }

  // Renderizar header
  renderHeader(section, templateStyles) {
    const { name, title, email, phone, location } = section.content
    return `
      <div style="
        background: ${templateStyles.header.backgroundColor || '#1e40af'};
        color: ${templateStyles.header.color || 'white'};
        padding: 30px;
        border-radius: 12px;
        text-align: center;
        margin-bottom: 20px;
      ">
        <h1 style="
          font-size: 32px;
          font-weight: bold;
          margin: 0 0 10px 0;
          color: ${templateStyles.header.color || 'white'};
        ">${name || 'Nombre Apellido'}</h1>
        <h2 style="
          font-size: 20px;
          font-weight: 500;
          margin: 0 0 15px 0;
          color: ${templateStyles.header.color || 'white'};
          opacity: 0.9;
        ">${title || 'Título Profesional'}</h2>
        <div style="
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        ">
          ${email ? `<span>📧 ${email}</span>` : ''}
          ${phone ? `<span>📱 ${phone}</span>` : ''}
          ${location ? `<span>📍 ${location}</span>` : ''}
        </div>
      </div>
    `
  }

  // Renderizar summary
  renderSummary(section, templateStyles) {
    const { text } = section.content
    if (!text) return ''
    
    return `
      <div style="
        background: ${templateStyles.sections.backgroundColor || 'white'};
        border: 1px solid ${templateStyles.sections.border || '#e5e7eb'};
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      ">
        <h3 style="
          font-size: 18px;
          font-weight: bold;
          margin: 0 0 15px 0;
          color: ${templateStyles.text.primary || '#1f2937'};
        ">RESUMEN PROFESIONAL</h3>
        <p style="
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
          color: ${templateStyles.text.secondary || '#6b7280'};
        ">${text}</p>
      </div>
    `
  }

  // Renderizar experiencia
  renderExperience(section, templateStyles) {
    if (!section.content || section.content.length === 0) return ''
    
    const experienceItems = section.content.map(exp => `
      <div style="margin-bottom: 20px;">
        <h4 style="
          font-size: 16px;
          font-weight: bold;
          margin: 0 0 5px 0;
          color: ${templateStyles.text.primary || '#1f2937'};
        ">${exp.title || 'Título del puesto'}</h4>
        <p style="
          font-size: 14px;
          color: ${templateStyles.text.accent || '#3b82f6'};
          margin: 0 0 10px 0;
        ">${exp.company || 'Empresa'} • ${exp.period || 'Período'}</p>
        ${exp.highlights && exp.highlights.length > 0 ? `
          <ul style="margin: 0; padding-left: 20px;">
            ${exp.highlights.map(highlight => `
              <li style="
                font-size: 13px;
                line-height: 1.5;
                margin-bottom: 5px;
                color: ${templateStyles.text.secondary || '#6b7280'};
              ">${highlight}</li>
            `).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('')
    
    return `
      <div style="
        background: ${templateStyles.sections.backgroundColor || 'white'};
        border: 1px solid ${templateStyles.sections.border || '#e5e7eb'};
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      ">
        <h3 style="
          font-size: 18px;
          font-weight: bold;
          margin: 0 0 20px 0;
          color: ${templateStyles.text.primary || '#1f2937'};
        ">EXPERIENCIA LABORAL</h3>
        ${experienceItems}
      </div>
    `
  }

  // Renderizar habilidades
  renderSkills(section, templateStyles) {
    const { hard, soft } = section.content
    if ((!hard || hard.length === 0) && (!soft || soft.length === 0)) return ''
    
    const hardSkills = hard && hard.length > 0 ? `
      <div style="margin-bottom: 15px;">
        <h4 style="
          font-size: 14px;
          font-weight: bold;
          margin: 0 0 10px 0;
          color: ${templateStyles.text.primary || '#1f2937'};
        ">Habilidades Técnicas</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${hard.map(skill => `
            <span style="
              background: ${templateStyles.text.accent || '#3b82f6'};
              color: white;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
            ">${skill.name} (${skill.level})</span>
          `).join('')}
        </div>
      </div>
    ` : ''
    
    const softSkills = soft && soft.length > 0 ? `
      <div>
        <h4 style="
          font-size: 14px;
          font-weight: bold;
          margin: 0 0 10px 0;
          color: ${templateStyles.text.primary || '#1f2937'};
        ">Habilidades Blandas</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${soft.map(skill => `
            <span style="
              background: #10b981;
              color: white;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
            ">${skill.name}</span>
          `).join('')}
        </div>
      </div>
    ` : ''
    
    return `
      <div style="
        background: ${templateStyles.sections.backgroundColor || 'white'};
        border: 1px solid ${templateStyles.sections.border || '#e5e7eb'};
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      ">
        <h3 style="
          font-size: 18px;
          font-weight: bold;
          margin: 0 0 20px 0;
          color: ${templateStyles.text.primary || '#1f2937'};
        ">HABILIDADES</h3>
        ${hardSkills}
        ${softSkills}
      </div>
    `
  }

  // Renderizar educación
  renderEducation(section, templateStyles) {
    if (!section.content || section.content.length === 0) return ''
    
    const educationItems = section.content.map(edu => `
      <div style="margin-bottom: 15px;">
        <h4 style="
          font-size: 16px;
          font-weight: bold;
          margin: 0 0 5px 0;
          color: ${templateStyles.text.primary || '#1f2937'};
        ">${edu.degree || 'Grado académico'}</h4>
        <p style="
          font-size: 14px;
          color: ${templateStyles.text.accent || '#3b82f6'};
          margin: 0 0 5px 0;
        ">${edu.institution || 'Institución'}</p>
        <p style="
          font-size: 13px;
          color: ${templateStyles.text.secondary || '#6b7280'};
          margin: 0;
        ">${edu.period || 'Período'}${edu.field ? ` • ${edu.field}` : ''}</p>
      </div>
    `).join('')
    
    return `
      <div style="
        background: ${templateStyles.sections.backgroundColor || 'white'};
        border: 1px solid ${templateStyles.sections.border || '#e5e7eb'};
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      ">
        <h3 style="
          font-size: 18px;
          font-weight: bold;
          margin: 0 0 20px 0;
          color: ${templateStyles.text.primary || '#1f2937'};
        ">EDUCACIÓN</h3>
        ${educationItems}
      </div>
    `
  }

  // Renderizar certificaciones
  renderCertifications(section, templateStyles) {
    if (!section.content || section.content.length === 0) return ''
    
    const certItems = section.content.map(cert => `
      <div style="margin-bottom: 10px;">
        <span style="
          font-size: 14px;
          font-weight: 500;
          color: ${templateStyles.text.primary || '#1f2937'};
        ">• ${cert.name}</span>
        ${cert.issuer || cert.date ? `
          <span style="
            font-size: 13px;
            color: ${templateStyles.text.secondary || '#6b7280'};
            margin-left: 10px;
          ">(${[cert.issuer, cert.date].filter(Boolean).join(' • ')})</span>
        ` : ''}
      </div>
    `).join('')
    
    return `
      <div style="
        background: ${templateStyles.sections.backgroundColor || 'white'};
        border: 1px solid ${templateStyles.sections.border || '#e5e7eb'};
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      ">
        <h3 style="
          font-size: 18px;
          font-weight: bold;
          margin: 0 0 15px 0;
          color: ${templateStyles.text.primary || '#1f2937'};
        ">CERTIFICACIONES</h3>
        ${certItems}
      </div>
    `
  }

  // Renderizar idiomas
  renderLanguages(section, templateStyles) {
    if (!section.content || section.content.length === 0) return ''
    
    const langItems = section.content.map(lang => `
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      ">
        <span style="
          font-size: 14px;
          font-weight: 500;
          color: ${templateStyles.text.primary || '#1f2937'};
        ">${lang.name}</span>
        <span style="
          font-size: 13px;
          color: ${templateStyles.text.secondary || '#6b7280'};
        ">${lang.level}</span>
      </div>
    `).join('')
    
    return `
      <div style="
        background: ${templateStyles.sections.backgroundColor || 'white'};
        border: 1px solid ${templateStyles.sections.border || '#e5e7eb'};
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      ">
        <h3 style="
          font-size: 18px;
          font-weight: bold;
          margin: 0 0 15px 0;
          color: ${templateStyles.text.primary || '#1f2937'};
        ">IDIOMAS</h3>
        ${langItems}
      </div>
    `
  }

  // Obtener estilos del template
  getTemplateStyles(template) {
    if (!template) {
      return {
        header: { backgroundColor: '#1e40af', color: 'white' },
        sections: { backgroundColor: 'white', border: '#e5e7eb' },
        text: { primary: '#1f2937', secondary: '#6b7280', accent: '#3b82f6' }
      }
    }
    
    return {
      header: template.styles?.header || { backgroundColor: '#1e40af', color: 'white' },
      sections: template.styles?.sections || { backgroundColor: 'white', border: '#e5e7eb' },
      text: template.styles?.text || { primary: '#1f2937', secondary: '#6b7280', accent: '#3b82f6' }
    }
  }

  // Generar PDF
  async generatePDF(filename) {
    if (!this.canvas) {
      throw new Error('No hay canvas para generar PDF')
    }
    
    const imgData = this.canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pdfWidth
    const imgHeight = (this.canvas.height * imgWidth) / this.canvas.width
    
    let heightLeft = imgHeight
    let position = 0
    
    // Primera página
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pdfHeight
    
    // Páginas adicionales si es necesario
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight
    }
    
    // Guardar PDF
    pdf.save(filename)
  }
}

export default new PDFExportService()
