export interface Profile {
  name: string
  headline: { pt: string; en: string }
  contacts: {
    email: string
    phone: string
    linkedin: string
    github: string
    website: string
  }
  summary: { pt: string; en: string }
  languages: { pt: string; en: string }
}

export const profile: Profile = {
  name: 'Jean Souza',
  headline: {
    pt: 'Engenheiro Frontend Senior',
    en: 'Senior Frontend Engineer',
  },
  contacts: {
    email: 'contato@jeansouza.dev',
    phone: '+55 34 9 9999-0000',
    linkedin: 'linkedin.com/in/jeancosouza',
    github: 'github.com/jeancarlos',
    website: 'jeansouza.dev',
  },
  summary: {
    pt: 'Mais de 15 anos desenvolvendo interfaces web em produção, da era jQuery até React 19, Next.js 16 App Router, React Server Components e busca de dados com Suspense. Em healthtech, e-commerce e telecom, entreguei design systems, arquiteturas de micro-frontends em escala e bibliotecas open source. Diferencial real: homelab em produção com 50+ containers Docker, deploys blue/green e automação em Python. Três anos de ops real, não projeto paralelo. Uso Claude Code e Windsurf como parte central do fluxo de trabalho. Inglês C2 certificado (EF SET 82/100).',
    en: "15+ years building production web interfaces, from the jQuery era through React 19, Next.js 16 App Router, React Server Components, and Suspense-driven data fetching. Across healthtech, e-commerce, and telecom I've shipped design systems, micro-frontend architectures at scale, and open source libraries. Real differentiator: production homelab running 50+ Docker containers with blue/green deployments and Python automation. Three years of real ops, not side projects. I use Claude Code and Windsurf as a core part of my daily engineering workflow. C2 English certified (EF SET 82/100).",
  },
  languages: {
    pt: 'Português (nativo) · Inglês C2 — EF SET 82/100',
    en: 'Portuguese (native) · English C2 — EF SET 82/100',
  },
}
