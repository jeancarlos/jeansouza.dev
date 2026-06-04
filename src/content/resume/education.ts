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
      pt: 'Análise e Desenvolvimento de Sistemas',
      en: 'Systems Analysis and Development',
    },
    period: {
      pt: '2010 – 2012 (incompleto)',
      en: '2010 – 2012 (incomplete)',
    },
  },
]
