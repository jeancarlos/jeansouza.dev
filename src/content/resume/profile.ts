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
    pt: 'Engenheiro Front-End Senior | React · Next.js · TypeScript',
    en: 'Senior Front-End Engineer | React · Next.js · TypeScript',
  },
  contacts: {
    email: 'contato@jeansouza.dev',
    phone: '+55 34 991949299',
    linkedin: 'linkedin.com/in/jeancosouza',
    github: 'github.com/jeancarlos',
    website: 'jeansouza.dev',
  },
  summary: {
    pt: 'Mais de 15 anos construindo interfaces de produção — da era do jQuery até React 19 e Next.js 16 App Router com React Server Components e Server Actions em escala. Ao longo desse tempo, entreguei arquiteturas de micro-frontends, design systems e uma biblioteca open source em healthtech, e-commerce e telecom — com deploy no Vercel e em cloud providers, sustentado por pipelines CI/CD com Jest, React Testing Library e Playwright E2E, ajudando times a atingir 92% de cobertura de testes e TDD como prática padrão. O que me diferencia da maioria dos front-ends: opero um homelab em produção com 50+ containers Docker, deploys blue/green e automação extensiva em Python — três anos de operação contínua, zero downtime. Ferramentas de IA (Claude Code, Windsurf, Codex) fazem parte do meu fluxo diário, não são experimento. Inglês C2 — EF SET 82/100.',
    en: '15+ years building production-grade web interfaces — from the jQuery era through React 19 and Next.js 16 App Router, including React Server Components and Server Actions at scale. I\'ve shipped micro-frontend architectures, design systems, and an open source library across healthtech, e-commerce, and telecom, deploying to Vercel and cloud providers with CI/CD pipelines backed by Jest, React Testing Library, and Playwright E2E — helping teams reach 92% test coverage and TDD as standard practice. What sets me apart from most front-end engineers: I operate a production homelab with 50+ Docker containers, blue/green deployments, and extensive Python automation — three years of continuous, zero-downtime operation. AI tooling (Claude Code, Windsurf, Codex) is part of my daily workflow, not an experiment. C2 English — EF SET 82/100.',
  },
  languages: {
    pt: 'Português (nativo) · Inglês C2 — EF SET 82/100',
    en: 'Portuguese (native) · English C2 — EF SET 82/100',
  },
}
