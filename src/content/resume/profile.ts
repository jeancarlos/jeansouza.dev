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
    pt: 'Mais de 15 anos desenvolvendo interfaces web em produção, da era jQuery até React 19, Next.js 16 App Router e React Server Components, com especialidade central em React, Next.js e TypeScript. Em healthtech, e-commerce e telecom, entreguei design systems, micro-frontends em escala e bibliotecas open source, incluindo 92% de cobertura de testes no Luizalabs e redução de 67% no tempo de build na Zydon. Na intersecção entre frontend e infraestrutura, opero um homelab em produção com 50+ containers Docker, deploys blue/green e automação em Python: três anos de ops real, não projeto paralelo. Inglês C2 certificado (EF SET 82/100) e uso ativo de assistentes de IA (Claude Code, Windsurf) como parte central do fluxo de trabalho diário.',
    en: "15+ years building production web interfaces, from the jQuery era through React 19, Next.js 16 App Router, and React Server Components, specializing in React, Next.js, and TypeScript. Across healthtech, e-commerce, and telecom I've shipped design systems, micro-frontends at scale, and open source libraries, including 92% test coverage at Luizalabs and a 67% build-time reduction at Zydon. At the intersection of frontend and infrastructure, I run a production homelab with 50+ Docker containers, blue/green deployments, and Python automation: three years of real ops, not side projects. C2-certified English (EF SET 82/100) and active daily use of AI assistants (Claude Code, Windsurf) as a core part of my engineering workflow.",
  },
  languages: {
    pt: 'Português (nativo) · Inglês C2 (EF SET 82/100)',
    en: 'Portuguese (native) · English C2 (EF SET 82/100)',
  },
}
