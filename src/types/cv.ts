export interface CVData {
  id: string
  name: string
  template: TemplateType
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin?: string
    website?: string
  }
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: string[]
  certifications?: CertificationItem[]
  projects?: ProjectItem[]
}

export interface ExperienceItem {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface EducationItem {
  id: string
  institution: string
  degree: string
  year: string
  gpa?: string
}

export interface CertificationItem {
  id: string
  name: string
  issuer: string
  year: string
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
}

export type TemplateType = "moderno" | "clasico" | "minimalista" | "ejecutivo" | "creativo" | "academico"

export interface CVTemplate {
  id: TemplateType
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    text: string
    background: string
    accent?: string
  }
  layout: "single" | "double"
  style: string
}
