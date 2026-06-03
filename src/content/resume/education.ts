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
      pt: '2010 – 2012',
      en: '2010 – 2012',
    },
  },
  {
    id: 'efset',
    institution: 'EF SET',
    degree: {
      pt: 'Certificação de Inglês C2 — 82/100',
      en: 'English C2 Certificate — 82/100',
    },
    period: {
      pt: '2023',
      en: '2023',
    },
  },
]
