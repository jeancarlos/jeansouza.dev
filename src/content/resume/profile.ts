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
  name: 'Jean Carlos Souza',
  headline: {
    pt: 'Engenheiro Front-End Sênior',
    en: 'Senior Front-End Engineer',
  },
  contacts: {
    email: 'contato@jeansouza.dev',
    phone: '+55 34 9 9999-0000',
    linkedin: 'linkedin.com/in/jeancosouza',
    github: 'github.com/jeancarlos',
    website: 'jeansouza.dev',
  },
  summary: {
    pt: 'Engenheiro Front-End Sênior com mais de 13 anos de experiência construindo interfaces escaláveis e sistemas de design em React, Next.js e TypeScript. Liderou times técnicos e iniciativas de qualidade que resultaram em 70% de cobertura de testes, redução de 67% no tempo de build e queda de regressões de 25% para menos de 5%. Referência em micro-frontends, Web Components, acessibilidade WCAG e estratégias de renderização SSR/SSG com impacto direto em Core Web Vitals e SEO. Defensor de workflows com IA e automação de CI/CD para acelerar entregas sem sacrificar confiabilidade.',
    en: 'Senior Front-End Engineer with 13+ years of experience building scalable interfaces and design systems in React, Next.js, and TypeScript. Led technical teams and quality initiatives that delivered 70% test coverage, a 67% reduction in build time, and a drop in bug regression from 25% to below 5%. Expert in micro-frontends, Web Components, WCAG accessibility, and SSR/SSG rendering strategies with measurable Core Web Vitals and SEO impact. Champion of AI-assisted workflows and CI/CD automation to accelerate delivery without compromising reliability.',
  },
  languages: {
    pt: 'Português (nativo) · Inglês (C1 — EF SET)',
    en: 'Portuguese (native) · English (C1 — EF SET)',
  },
}
