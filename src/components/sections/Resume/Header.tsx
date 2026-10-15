import type { Profile } from '@/content/resume/profile'

interface Props {
  profile: Profile
  locale: 'pt' | 'en'
}

export function Header({ profile, locale }: Props) {
  return (
    <>
      <h1 className="font-display text-brand-text">{profile.name}</h1>
      <p className="text-brand-muted -mt-4 mb-4 font-mono text-sm">{profile.headline[locale]}</p>
    </>
  )
}
