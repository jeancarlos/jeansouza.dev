import type { Profile } from '@/content/resume/profile'

interface Props {
  profile: Profile
  locale: 'pt' | 'en'
}

export function Header({ profile, locale }: Props) {
  return (
    <header className="mb-10">
      <h1 className="font-display text-text text-3xl font-bold">{profile.name}</h1>
      <p className="text-brand-text mt-1 text-lg">{profile.headline[locale]}</p>
    </header>
  )
}
