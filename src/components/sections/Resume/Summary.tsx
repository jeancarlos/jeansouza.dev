import type { Profile } from '@/content/resume/profile'

interface Props {
  profile: Profile
  locale: 'pt' | 'en'
}

export function Summary({ profile, locale }: Props) {
  return <p>{profile.summary[locale]}</p>
}
