import authService from './authService'

class PDFExportService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
  }

  /**
   * Exportar CV a PDF usando el backend
   */
  async exportToPDF(cvData, cvName, templateId) {
    try {
      const url = `${this.baseURL}/cv/export/pdf`
      const token = authService.accessToken
      
      console.log('🔍 PDFExportService: Exportando CV a PDF...')
      console.log('🔍 PDFExportService: Nombre:', cvName)
      console.log('🔍 PDFExportService: Template:', templateId)
      
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

      // Obtener el PDF como blob
      const pdfBlob = await response.blob()
      
      // Crear URL temporal para descarga
      const pdfUrl = window.URL.createObjectURL(pdfBlob)
      
      // Crear enlace de descarga
      const downloadLink = document.createElement('a')
      downloadLink.href = pdfUrl
      downloadLink.download = `${cvName || 'CV'}.pdf`
      
      // Simular click para descargar
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      
      // Limpiar URL temporal
      window.URL.revokeObjectURL(pdfUrl)
      
      console.log('✅ PDFExportService: PDF exportado exitosamente')
      return true
      
    } catch (error) {
      console.error('❌ PDFExportService: Error exportando PDF:', error)
      throw error
    }
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
        allowTaint: true
      })
      
      // Crear PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      
      let position = 0
      
      // Agregar imagen al PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      // Agregar páginas adicionales si es necesario
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      // Descargar PDF
      pdf.save(`${cvName || 'CV'}.pdf`)
      
      console.log('✅ PDFExportService: PDF exportado con fallback exitosamente')
      return true
      
    } catch (error) {
      console.error('❌ PDFExportService: Error en fallback:', error)
      throw error
    }
  }
}

export const pdfExportService = new PDFExportService()