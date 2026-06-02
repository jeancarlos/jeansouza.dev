export interface LinkItem {
  name: string
  url?: string
  content?: string
  icon: string
}

export const links: LinkItem[] = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/jeancosouza/',
    icon: 'fab fa-instagram',
  },
  {
    name: 'Discord',
    content: 'jeanrnk#5682',
    icon: 'fab fa-discord',
  },
  {
    name: 'Steam',
    content: 'jeanrnk',
    icon: 'fab fa-steam',
  },
  {
    name: 'Switch Friend Code',
    content: '1749 2384 1794',
    icon: 'fas fa-gamepad',
  },
  {
    name: 'Xbox gamertag',
    content: 'jeanrnk',
    icon: 'fab fa-xbox',
  },
  {
    name: 'PSN ID',
    content: 'jeanrnk',
    icon: 'fab fa-playstation',
  },
  {
    name: 'Source for this website',
    url: 'https://github.com/jeancarlos/jeansouza.dev',
    icon: 'fab fa-github',
  },
]
