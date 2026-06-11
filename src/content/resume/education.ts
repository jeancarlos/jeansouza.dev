export interface EducationEntry {
  id: string
  institution: string
  degree: { pt: string; en: string }
  period: { pt: string; en: string }
  description?: { pt: string; en: string }
}

export const education: EducationEntry[] = [
  {
    id: 'esamc',
    institution: 'ESAMC Uberlândia',
    degree: {
      pt: 'Design Gráfico (Incompleto)',
      en: 'Graphic Design (Incomplete)',
    },
    period: {
      pt: 'janeiro de 2008 – junho de 2010',
      en: 'January 2008 – June 2010',
    },
  },
]
