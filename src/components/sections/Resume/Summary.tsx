import type { Profile } from '@/content/resume/profile'

interface Props {
  profile: Profile
  locale: 'pt' | 'en'
}

export function Summary({ profile, locale }: Props) {
  return <p className="text-subtext mb-12 text-sm leading-relaxed">{profile.summary[locale]}</p>
}
