export interface CurriculoAsset {
  locale: 'pt' | 'en'
  format: 'pdf' | 'docx'
  url: string
}

export const CURRICULO_ASSETS: CurriculoAsset[] = [
  { locale: 'pt', format: 'pdf', url: '/curriculo/jean-souza-curriculo-pt.pdf' },
  { locale: 'pt', format: 'docx', url: '/curriculo/jean-souza-curriculo-pt.docx' },
  { locale: 'en', format: 'pdf', url: '/curriculo/jean-souza-resume-en.pdf' },
  { locale: 'en', format: 'docx', url: '/curriculo/jean-souza-resume-en.docx' },
]
