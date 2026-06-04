export interface Accomplishment {
  tags: string[]
  pt: string
  en: string
}

export interface TimelineEntry {
  id: string
  year: { pt: string; en: string }
  role: { pt: string; en: string }
  company: string
  location?: { pt: string; en: string }
  accomplishments: Accomplishment[]
  selectedSeniorFront?: Accomplishment[]
}

const zydon: TimelineEntry = {
  id: 'zydon',
  year: {
    pt: 'outubro 2024 – março 2026',
    en: 'October 2024 – March 2026',
  },
  role: {
    pt: 'Desenvolvedor Front-End Senior (React/Next.js/TypeScript)',
    en: 'Senior Front-End Engineer (React/Next.js/TypeScript)',
  },
  company: 'Zydon',
  location: { pt: 'Uberlândia, MG', en: 'Uberlândia, Brazil' },
  accomplishments: [
    {
      tags: ['testing', 'coverage', 'micro-frontends'],
      pt: 'Suite de testes criada do zero num ambiente multi-repo de micro-frontends: 70% de cobertura total onde antes não existia nenhuma.',
      en: 'Built the testing suite from scratch across a multi-repo micro-frontend environment, reaching 70% total coverage where none had existed before.',
    },
    {
      tags: [],
      pt: 'Pipeline de CI otimizado: tempo de build caiu de 1 hora para 20 minutos (redução de 67%), com observabilidade adicionada via instrumentação de logs e métricas.',
      en: 'CI pipeline optimized: build time dropped from 1 hour to 20 minutes (67% reduction), with observability added through log and metric instrumentation.',
    },
    {
      tags: ['testing'],
      pt: 'Taxa de regressão de bugs caiu de ~25% para abaixo de 5%, com padronização de code reviews e validações automáticas de CI em pull requests.',
      en: 'Bug regression rate dropped from ~25% to below 5% through standardized code reviews and automated CI validation on every pull request.',
    },
    {
      tags: [],
      pt: 'Introdução de workflows com IA (Claude Code, Windsurf, Codex) no processo do time: menos retrabalho, ciclos de revisão mais curtos e entregas mais confiáveis.',
      en: 'Introduced AI-assisted workflows (Claude Code, Windsurf, Codex) across the team: less rework, faster review cycles, more reliable releases.',
    },
    {
      tags: [],
      pt: 'Infraestrutura e pipelines de CI/CD implantados e mantidos no provedor de nuvem AWS.',
      en: 'Infrastructure and CI/CD pipelines deployed and maintained on AWS.',
    },
  ],
}
zydon.selectedSeniorFront = [
  zydon.accomplishments[0],
  zydon.accomplishments[1],
  zydon.accomplishments[2],
]

const mutant: TimelineEntry = {
  id: 'mutant',
  year: {
    pt: 'janeiro 2024 – agosto 2024',
    en: 'January 2024 – August 2024',
  },
  role: {
    pt: 'Desenvolvedor Front-End Senior (TypeScript)',
    en: 'Senior Front-End Engineer (TypeScript)',
  },
  company: 'Mutant',
  location: { pt: 'São Paulo, SP', en: 'São Paulo, Brazil' },
  accomplishments: [
    {
      tags: ['web-components', 'lit', 'micro-frontends'],
      pt: 'Liderança técnica da equipe na criação de uma biblioteca de Web Components (Lit) para o cliente Vivo, interoperável entre Angular e React em arquitetura de micro-frontends sem necessidade de reescritas por framework.',
      en: "Led the team in building a Web Components library (Lit) for Vivo, one of Brazil's largest telcos, fully interoperable across Angular and React in a micro-frontend architecture with no per-framework rewrites needed.",
    },
    {
      tags: ['wcag', 'accessibility'],
      pt: '100% dos componentes em conformidade WCAG 2.1 AA: biblioteca acessível a tecnologias assistivas, reduzindo o risco legal do cliente.',
      en: "100% of components shipped WCAG 2.1 AA-compliant, making the entire library accessible to assistive technologies and reducing the client's legal exposure.",
    },
    {
      tags: ['micro-frontends'],
      pt: 'Monorepo estruturado com Lerna para que cada squad importasse apenas o necessário, reduzindo bundle size e acoplamento entre times.',
      en: 'Lerna monorepo structured so each squad imported only what it needed, cutting bundle size and reducing coupling between teams.',
    },
  ],
}
mutant.selectedSeniorFront = [
  mutant.accomplishments[0],
  mutant.accomplishments[1],
  mutant.accomplishments[2],
]

const runrunit: TimelineEntry = {
  id: 'runrunit',
  year: {
    pt: 'agosto 2022 – outubro 2023',
    en: 'August 2022 – October 2023',
  },
  role: {
    pt: 'Desenvolvedor Front-End Senior (React)',
    en: 'Senior Front-End Engineer (React)',
  },
  company: 'Runrun.it',
  location: { pt: 'São Paulo, SP', en: 'São Paulo, Brazil' },
  accomplishments: [
    {
      tags: ['react', 'hooks'],
      pt: 'Ferramenta de ações em massa desenvolvida com React e hooks customizados, adotada em múltiplos fluxos críticos do produto; os hooks abstraíam o legado em Backbone para devs novos não precisarem aprender a stack antiga.',
      en: "Built the bulk-actions tool used across multiple critical flows of the main product, with React and custom hooks abstracting the legacy Backbone integration so new engineers didn't need to learn the old stack.",
    },
    {
      tags: ['react', 'performance'],
      pt: 'Definição da estratégia de migração incremental de Backbone → React com Webpack e code-splitting por rota: novas features React entregues sem reescrita total, preservando os fluxos existentes e melhorando os scores de performance no Lighthouse.',
      en: 'Defined the incremental Backbone → React migration strategy with Webpack and per-route code-splitting: new React features shipped without a full rewrite, preserving existing user flows and improving Lighthouse performance scores.',
    },
    {
      tags: ['hooks'],
      pt: 'Padrões de qualidade estabelecidos (ESLint, code review, arquitetura de hooks) que o time continuou usando depois da minha saída.',
      en: 'Code quality standards established (ESLint, review guidelines, hook architecture) that the team kept using after I left.',
    },
  ],
}
runrunit.selectedSeniorFront = [
  runrunit.accomplishments[0],
  runrunit.accomplishments[1],
  runrunit.accomplishments[2],
]

const luizalabs: TimelineEntry = {
  id: 'luizalabs',
  year: {
    pt: 'janeiro 2020 – junho 2022',
    en: 'January 2020 – June 2022',
  },
  role: {
    pt: 'Desenvolvedor Front-End Senior (React/TypeScript)',
    en: 'Senior Front-End Engineer (React/TypeScript)',
  },
  company: 'Luizalabs',
  location: { pt: 'Uberlândia, MG', en: 'Uberlândia, Brazil' },
  accomplishments: [
    {
      tags: ['testing', 'coverage', 'jest', 'rtl', 'tdd'],
      pt: '92% de cobertura de testes com Jest + RTL no projeto principal, o número que desbloqueou a adoção do pipeline de continuous delivery da empresa e virou referência interna.',
      en: "92% test coverage with Jest + RTL on the main project, the milestone that unlocked the company's continuous delivery pipeline and became an internal quality benchmark.",
    },
    {
      tags: ['micro-frontends', 'state-management'],
      pt: 'Micro-frontends arquitetados e integrados à plataforma interna do Magalu, com Git Flow e Conventional Commits como padrão de entrega.',
      en: 'Micro-frontend applications architected and integrated into the Magalu internal platform, with Git Flow and Conventional Commits as delivery standards.',
    },
    {
      tags: ['testing', 'coverage'],
      pt: 'Projeto legado sem cobertura alguma recebeu testes unitários e passou a ter deploy automatizado, eliminando o risco de regressão manual em cada release.',
      en: 'Introduced unit tests and automated deployments to a legacy project with zero coverage, eliminating manual regression checks on every release.',
    },
  ],
}
luizalabs.selectedSeniorFront = [
  luizalabs.accomplishments[0],
  luizalabs.accomplishments[2],
  luizalabs.accomplishments[1],
]

const vitta: TimelineEntry = {
  id: 'vitta',
  year: {
    pt: 'agosto 2017 – janeiro 2020',
    en: 'August 2017 – January 2020',
  },
  role: {
    pt: 'Desenvolvedor Full-Stack (Vue/TypeScript/Node)',
    en: 'Full-Stack Engineer (Vue/TypeScript/Node)',
  },
  company: 'Vitta',
  location: { pt: 'Uberlândia, MG', en: 'Uberlândia, Brazil' },
  accomplishments: [
    {
      tags: ['design-system'],
      pt: 'Vi-Ui criado e liderado como projeto open source: biblioteca de componentes Vue que virou a base do design system da empresa.',
      en: "Created and led Vi-Ui, an open source Vue component library that became the foundation of the company's design system.",
    },
    {
      tags: ['figma', 'design-system'],
      pt: 'Design system interno desenvolvido para unificar a linguagem visual entre as aplicações: menos inconsistência de UI, mais velocidade para novas features.',
      en: 'Internal design system developed to unify visual language across all company applications: less UI inconsistency, faster feature delivery.',
    },
    {
      tags: [],
      pt: 'Microserviço Node + Express + Puppeteer que centraliza a geração de documentos imprimíveis de toda a plataforma, usado em 100% dos fluxos clínicos por médicos e pacientes.',
      en: 'Node + Express + Puppeteer microservice built to centralize printable document generation across the platform, used in 100% of clinical workflows by doctors and patients.',
    },
    {
      tags: ['typescript'],
      pt: 'API Node + TypeScript para retorno de registros médicos em conformidade com a LGPD, com privacidade de dados garantida antes mesmo da lei entrar em vigor.',
      en: "Node + TypeScript API for medical record retrieval built in compliance with Brazil's LGPD (GDPR equivalent), ensuring data privacy protections were in place ahead of enforcement.",
    },
  ],
}
vitta.selectedSeniorFront = [
  vitta.accomplishments[0],
  vitta.accomplishments[1],
  vitta.accomplishments[2],
]

const luxcontrol: TimelineEntry = {
  id: 'luxcontrol',
  year: {
    pt: 'abril 2012 – julho 2017',
    en: 'April 2012 – July 2017',
  },
  role: {
    pt: 'Desenvolvedor Front-End Senior',
    en: 'Senior Front-End Engineer',
  },
  company: 'LuxControl Automação Residencial',
  location: { pt: 'Uberlândia, MG', en: 'Uberlândia, Brazil' },
  accomplishments: [
    {
      tags: ['performance'],
      pt: '5 anos liderando o front-end de um sistema embarcado para automação residencial, em ambiente sem internet e com restrições severas de performance e segurança.',
      en: '5 years leading front-end development for an embedded home automation system: air-gapped, strict performance constraints, no room for deployment mistakes.',
    },
    {
      tags: ['performance'],
      pt: 'Interface responsiva construída e mantida para touchscreens, painéis de parede e clientes mobile, todos em hardware embarcado com restrições severas de CPU/memória e sem acesso externo à rede.',
      en: 'Built and maintained a responsive UI across touchscreens, wall panels, and mobile clients, all running on constrained embedded hardware with no external network access.',
    },
    {
      tags: ['react'],
      pt: 'React e consumo de APIs REST introduzidos no sistema legado sem interromper o serviço para clientes já em produção.',
      en: 'React and REST API consumption introduced to the legacy system without interrupting service for customers already running in production.',
    },
  ],
}
luxcontrol.selectedSeniorFront = [
  luxcontrol.accomplishments[0],
  luxcontrol.accomplishments[1],
  luxcontrol.accomplishments[2],
]

const bockz: TimelineEntry = {
  id: 'bockz',
  year: {
    pt: 'setembro 2011 – abril 2012',
    en: 'September 2011 – April 2012',
  },
  role: {
    pt: 'Desenvolvedor Full-Stack (PHP/MySQL)',
    en: 'Full-Stack Developer (PHP/MySQL)',
  },
  company: 'Bockz',
  accomplishments: [
    {
      tags: ['php', 'mysql', 'wordpress', 'seo'],
      pt: 'Desenvolvimento full-stack com PHP e MySQL, incluindo customização profunda de temas e plugins WordPress. Foco em SEO on-page, semântica e performance de sites institucionais.',
      en: 'Full-stack development using PHP and MySQL, including deep WordPress theme and plugin customization. Heavy focus on on-page SEO, semantic structure, and page speed for corporate sites.',
    },
  ],
}

const openk: TimelineEntry = {
  id: 'openk',
  year: {
    pt: 'janeiro 2011 – agosto 2011',
    en: 'January 2011 – August 2011',
  },
  role: {
    pt: 'Desenvolvedor Full-Stack',
    en: 'Full-Stack Developer',
  },
  company: 'OpenK Tecnologia',
  accomplishments: [
    {
      tags: ['java', 'php', 'html', 'css', 'seo'],
      pt: 'Portais corporativos em Java (JSP/Servlets) e PHP com layouts em HTML5/CSS3. Aplicação de boas práticas de acessibilidade e SEO técnico em ambiente de equipe.',
      en: 'Corporate portals built with Java (JSP/Servlets) and PHP, integrating responsive layouts in HTML5/CSS3 with web accessibility and basic technical SEO best practices.',
    },
  ],
}

const webroom: TimelineEntry = {
  id: 'webroom',
  year: {
    pt: 'novembro 2008 – fevereiro 2010',
    en: 'November 2008 – February 2010',
  },
  role: {
    pt: 'Programador de Interface',
    en: 'Interface Programmer',
  },
  company: 'Webroom Soluções Interativas',
  accomplishments: [
    {
      tags: ['jquery', 'javascript', 'html', 'css', 'seo'],
      pt: 'Interfaces dinâmicas com jQuery e Vanilla JS em agência digital. Foco em performance de carregamento, compatibilidade cross-browser e SEO para portais de e-commerce e sites institucionais.',
      en: 'Dynamic interfaces using jQuery and Vanilla JavaScript at a digital agency. Focused on page load performance, cross-browser consistency, and on-page SEO for e-commerce and corporate sites.',
    },
  ],
}

const lalli: TimelineEntry = {
  id: 'lalli',
  year: {
    pt: 'abril 2008 – novembro 2008',
    en: 'April 2008 – November 2008',
  },
  role: {
    pt: 'Web Designer',
    en: 'Web Designer',
  },
  company: 'Lalli Bureau',
  accomplishments: [
    {
      tags: ['webdesign', 'html', 'css', 'photoshop'],
      pt: 'Primeiro contato com TI: UI design com Photoshop e Fireworks, design gráfico e diagramação impressa (Illustrator, InDesign, CorelDraw). Conversão de layouts para HTML/CSS semântico e otimizado para SEO.',
      en: 'First contact with IT: UI design using Photoshop and Fireworks, print graphic design and layout for magazines and catalogs. Hand-coded layouts to semantic, accessible, SEO-optimized HTML/CSS.',
    },
  ],
}

export const timeline: TimelineEntry[] = [
  zydon,
  mutant,
  runrunit,
  luizalabs,
  vitta,
  luxcontrol,
  bockz,
  openk,
  webroom,
  lalli,
]
