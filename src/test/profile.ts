import type { Profile } from '@/content/resume/profile'

export function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    name: 'Jean Test',
    headline: { pt: 'Dev PT', en: 'Dev EN' },
    contacts: {
      email: 'test@test.dev',
      phone: '+55 34 9 0000-0000',
      linkedin: 'linkedin.com/in/test',
      github: 'github.com/test',
      website: 'test.dev',
    },
    summary: { pt: 'Resumo PT', en: 'Summary EN' },
    languages: { pt: 'Português', en: 'Portuguese' },
    ...overrides,
  }
}
