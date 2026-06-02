export interface TimelineEntry {
  id: string
  year: string
  role: { pt: string; en: string }
  company: string
  description: { pt: string; en: string }
}

export const timeline: TimelineEntry[] = [
  {
    id: 'entry-1',
    year: '2024',
    role: { pt: 'Engenheiro Sênior Front-End', en: 'Senior Front-End Engineer' },
    company: 'Empresa Atual',
    description: {
      pt: 'Descreva sua experiência atual aqui.',
      en: 'Describe your current experience here.',
    },
  },
  {
    id: 'entry-2',
    year: '2022',
    role: { pt: 'Engenheiro Front-End Pleno', en: 'Mid-Level Front-End Engineer' },
    company: 'Empresa Anterior',
    description: {
      pt: 'Descreva sua experiência anterior aqui.',
      en: 'Describe your previous experience here.',
    },
  },
]
