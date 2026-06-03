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
      <ul className="text-subtext mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs">
        <li>
          <a
            href={`mailto:${profile.contacts.email}`}
            className="hover:text-brand-text transition-colors"
          >
            {profile.contacts.email}
          </a>
        </li>
        <li>
          <a
            href={`https://${profile.contacts.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-text transition-colors"
          >
            {profile.contacts.linkedin}
          </a>
        </li>
        <li>
          <a
            href={`https://${profile.contacts.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-text transition-colors"
          >
            {profile.contacts.github}
          </a>
        </li>
        <li>
          <a
            href={`https://${profile.contacts.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-text transition-colors"
          >
            {profile.contacts.website}
          </a>
        </li>
      </ul>
    </header>
  )
}
