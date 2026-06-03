export interface Accomplishment {
  tags: string[]
  pt: string
  en: string
}

export interface TimelineEntry {
  id: string
  year: { pt: string; en: string }
  role: { pt: string; en: string }
  company: string
  accomplishments: Accomplishment[]
  selectedSeniorFront?: Accomplishment[]
}

export const timeline: TimelineEntry[] = [
  // populated by Task 7
]
