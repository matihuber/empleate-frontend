import type { CVTemplate } from "../types/cv"

export const CV_TEMPLATES: Record<string, CVTemplate> = {
  moderno: {
    id: "moderno",
    name: "Moderno",
    description: "Diseño limpio y tech-friendly",
    colors: {
      primary: "#1e40af",
      secondary: "#f3f4f6",
      text: "#111827",
      background: "#ffffff",
      accent: "#3b82f6",
    },
    layout: "single",
    style: "clean",
  },
  clasico: {
    id: "clasico",
    name: "Clásico",
    description: "Formato Harvard tradicional",
    colors: {
      primary: "#111827",
      secondary: "#6b7280",
      text: "#111827",
      background: "#ffffff",
      accent: "#374151",
    },
    layout: "double",
    style: "traditional",
  },
  minimalista: {
    id: "minimalista",
    name: "Minimalista",
    description: "Simple y elegante",
    colors: {
      primary: "#111827",
      secondary: "#f9fafb",
      text: "#111827",
      background: "#ffffff",
      accent: "#6b7280",
    },
    layout: "single",
    style: "minimal",
  },
  ejecutivo: {
    id: "ejecutivo",
    name: "Ejecutivo",
    description: "Profesional y sofisticado",
    colors: {
      primary: "#374151",
      secondary: "#111827",
      text: "#ffffff",
      background: "#1f2937",
      accent: "#6b7280",
    },
    layout: "single",
    style: "executive",
  },
  creativo: {
    id: "creativo",
    name: "Creativo",
    description: "Innovador y dinámico",
    colors: {
      primary: "#059669",
      secondary: "#3b82f6",
      text: "#111827",
      background: "#ffffff",
      accent: "#10b981",
    },
    layout: "single",
    style: "creative",
  },
  academico: {
    id: "academico",
    name: "Académico",
    description: "Serio e investigativo",
    colors: {
      primary: "#92400e",
      secondary: "#fef3c7",
      text: "#111827",
      background: "#ffffff",
      accent: "#d97706",
    },
    layout: "single",
    style: "academic",
  },
}

export const getTemplateStyles = (templateId: string) => {
  const template = CV_TEMPLATES[templateId]
  if (!template) return CV_TEMPLATES.moderno
  return template
}
