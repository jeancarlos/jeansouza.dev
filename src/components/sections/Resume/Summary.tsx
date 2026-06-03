import type { Profile } from '@/content/resume/profile'

interface Props {
  profile: Profile
  locale: 'pt' | 'en'
}

export function Summary({ profile, locale }: Props) {
  return (
    <p className="mb-12 max-w-2xl text-sm leading-relaxed text-latte-subtext">
      {profile.summary[locale]}
    </p>
  )
}
