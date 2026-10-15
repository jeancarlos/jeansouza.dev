export interface LinkItem {
  name: string
  url?: string
  content?: string
  primary?: boolean
}

const links: LinkItem[] = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/jeansouza.dev/',
  },
  {
    name: 'Bluesky',
    url: 'https://bsky.app/profile/jeansouza.dev',
  },
  {
    name: 'Discord',
    content: 'jeanrnk#5682',
  },
  {
    name: 'Steam',
    content: 'jeanrnk',
  },
  {
    name: 'Switch Friend Code',
    content: '1749 2384 1794',
  },
  {
    name: 'Xbox gamertag',
    content: 'jeanrnk',
  },
  {
    name: 'PSN ID',
    content: 'jeanrnk',
  },
  {
    name: 'Source for this website',
    url: 'https://github.com/jeancarlos/jeansouza.dev',
    primary: true,
  },
]

export const extraLinks: LinkItem[] = links.filter((l) => !l.primary)
