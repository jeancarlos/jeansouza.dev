export interface TimelineEntry {
  id: string
  year: { pt: string; en: string }
  role: { pt: string; en: string }
  company: string
  description: { pt: string; en: string }
}

export const timeline: TimelineEntry[] = [
  {
    id: 'job-1',
    year: {
      pt: 'outubro 2024 – março 2026 · Uberlândia, MG',
      en: 'October 2024 – March 2026 · Uberlândia, Brazil',
    },
    role: {
      pt: 'Desenvolvedor Front-End Senior',
      en: 'Senior Front-End Engineer',
    },
    company: 'Zydon',
    description: {
      pt: '• Suíte de testes criada do zero num ambiente multi-repo de micro-frontends: 70% de cobertura total onde antes não existia nenhuma.\n• Pipeline de CI otimizado: tempo de build caiu de 1 hora para 20 minutos (redução de 67%), com observabilidade adicionada via instrumentação de logs e métricas.\n• Taxa de regressão de bugs caiu de ~25% para abaixo de 5% — padronização de code reviews e validações automáticas de CI em pull requests.\n• Introdução de workflows com IA (Claude Code, Windsurf, Codex) no processo do time: menos retrabalho, ciclos de revisão mais curtos e entregas mais confiáveis.\n• Infraestrutura e pipelines de CI/CD implantados e mantidos no provedor de nuvem AWS.\n• Refatoração crítica da arquitetura de estados utilizando Redux e hooks customizados em Next.js a partir de especificações no Figma, reduzindo o consumo de memória client-side e otimizando os índices de Core Web Vitals do portal principal.\n• Modelagem e desacoplamento de micro-frontends em um ecossistema multi-repositório na Zydon, estabelecendo contratos de comunicação agnósticos e garantindo a autonomia completa de deploy para diferentes squads.\n• Cobertura end-to-end com Playwright integrada à pipeline de CI — fluxos críticos do produto validados automaticamente em cada pull request.\n• Estratégia de renderização SSR e SSG definida por rota com Next.js 16 App Router — performance de carregamento e indexação SEO otimizados para o portal principal.\n• Validação de schemas com Zod adotada em boundaries de API e formulários — type safety em runtime complementando as verificações estáticas do TypeScript.',
      en: "• Built the testing suite from scratch across a multi-repo micro-frontend environment — 70% total coverage where none had existed before.\n• CI pipeline optimized: build time dropped from 1 hour to 20 minutes (67% reduction), with observability added through log and metric instrumentation.\n• Bug regression rate dropped from ~25% to below 5% through standardized code reviews and automated CI validation on every pull request.\n• Introduced AI-assisted workflows (Claude Code, Windsurf, Codex) across the team: less rework, faster review cycles, more reliable releases.\n• Infrastructure and CI/CD pipelines deployed and maintained on AWS.\n• Executed critical state management refactoring using Redux and Next.js custom hooks from Figma specs, lowering client-side memory footprint and optimizing the portal's Core Web Vitals indices.\n• Modeled and decoupled micro-frontends within a multi-repository ecosystem at Zydon, establishing agnostic communication contracts and securing total deployment autonomy for multiple product squads.\n• End-to-end coverage with Playwright integrated into the CI pipeline — critical user flows validated automatically on every pull request.\n• SSR and SSG rendering strategy defined per route with Next.js 16 App Router — page load performance and SEO indexing optimized for the main portal.\n• Zod schema validation adopted at API boundaries and form inputs — runtime type safety complementing TypeScript's static checks.",
    },
  },
  {
    id: 'job-2',
    year: {
      pt: 'janeiro 2024 – agosto 2024 · São Paulo, SP',
      en: 'January 2024 – August 2024 · São Paulo, Brazil',
    },
    role: {
      pt: 'Desenvolvedor Front-End Senior (TypeScript)',
      en: 'Senior Front-End Engineer (TypeScript)',
    },
    company: 'Mutant',
    description: {
      pt: '• Liderança técnica da equipe na criação de uma biblioteca de Web Components (Lit) para o cliente Vivo — interoperável entre Angular e React em arquitetura de micro-frontends, sem necessidade de reescritas por framework.\n• 100% dos componentes em conformidade WCAG 2.1 AA: biblioteca acessível a tecnologias assistivas, reduzindo o risco legal do cliente.\n• Liderança na otimização e arquitetura da biblioteca de Web Components baseada em designs no Figma para torná-la 100% agnóstica, permitindo a integração direta de componentes de React para Angular de forma transparente, demonstrando conhecimento profundo de ambas as bibliotecas.\n• Documentação interativa da biblioteca de Web Components (Vivo) com Storybook — catálogo de componentes utilizado por times de design e desenvolvimento para validar e testar componentes em isolamento.',
      en: "• Led the team in building a Web Components library (Lit) for Vivo, one of Brazil's largest telcos — fully interoperable across Angular and React in a micro-frontend architecture, eliminating per-framework rewrites.\n• 100% of components shipped WCAG 2.1 AA-compliant, making the entire library accessible to assistive technologies and reducing the client's legal exposure.\n• Led the optimization and architecture of the Web Components library based on Figma layouts to make it 100% framework-agnostic, enabling direct, seamless component integration from React to Angular based on deep internal knowledge of both libraries.\n• Interactive documentation of the Vivo Web Components library with Storybook — component catalog used by design and development teams to validate and test components in isolation.",
    },
  },
  {
    id: 'job-3',
    year: {
      pt: 'agosto 2022 – outubro 2023 · São Paulo, SP',
      en: 'August 2022 – October 2023 · São Paulo, Brazil',
    },
    role: {
      pt: 'Desenvolvedor Front-End Senior (React)',
      en: 'Senior Front-End Engineer (React)',
    },
    company: 'Runrun.it',
    description: {
      pt: '• Ferramenta de ações em massa desenvolvida com React e hooks customizados, adotada em múltiplos fluxos críticos do produto — hooks abstraíam o legado em Backbone para devs novos não precisarem aprender a stack antiga.\n• Migração de módulos Backbone + Marionette para React: onboarding mais rápido para devs novos, custo de manutenção reduzido, stack mais sustentável.\n• Padrões de qualidade estabelecidos (ESLint, code review, arquitetura de hooks) que o time continuou usando depois da minha saída.\n• Arquitetura e implementação de uma integração nativa e transparente, a partir de designs no Figma, entre os novos módulos React e a base legada em Backbone/Marionette usando conhecimento profundo de Vanilla JavaScript e React, isolando o legado para que novos desenvolvedores pudessem produzir sem curva de aprendizado na stack antiga.\n• React Query (TanStack) adotado para gerenciamento de estado do servidor — substituição de lógica manual de fetch por data fetching declarativo, reduzindo boilerplate e melhorando a consistência de cache.',
      en: "• Built the bulk-actions tool used across multiple critical flows of the main product, with React and custom hooks abstracting the legacy Backbone integration so new engineers didn't need to learn the old stack.\n• Backbone + Marionette modules migrated to React: faster onboarding, lower maintenance cost, more sustainable architecture.\n• Code quality standards established (ESLint, review guidelines, hook architecture) that the team kept using after I left.\n• Architected and implemented a seamless native integration from Figma specifications between React components and the legacy Backbone/Marionette codebase utilizing deep JavaScript and React expertise, abstracting old layers so new hires could ship code without learning the legacy stack.\n• React Query (TanStack) adopted for server-state management — replaced manual fetch logic with declarative data fetching, reducing boilerplate and improving cache consistency across features.",
    },
  },
  {
    id: 'job-4',
    year: {
      pt: 'janeiro 2020 – junho 2022 · Uberlândia, MG',
      en: 'January 2020 – June 2022 · Uberlândia, Brazil',
    },
    role: {
      pt: 'Desenvolvedor Front-End Senior (React/TypeScript)',
      en: 'Senior Front-End Engineer (React/TypeScript)',
    },
    company: 'Luizalabs',
    description: {
      pt: '• Liderança colaborativa que ajudou a equipe a atingir 92% de cobertura de testes com Jest + RTL no projeto principal — o número que desbloqueou a adoção do pipeline de continuous delivery da empresa e virou referência interna.\n• Micro-frontends de alta escala arquitetados e integrados à plataforma unificada do Magalu, estabelecendo padrões de orquestração no client-side, compartilhamento de estado seguro e fluxos automatizados com Git Flow e Conventional Commits.\n• Projeto legado sem cobertura recebeu suíte de testes unitários e pipeline de deploy automatizado, reduzindo o tempo de release de 2 dias (manual) para apenas 1 hora com zero regressões.\n• Liderança na automação do pipeline de release utilizando Git Flow e Conventional Commits, integrando fluxos de design system mapeados no Figma e permitindo deploys frequentes e seguros em produção (Continuous Delivery).\n• Padronização do data fetching com React Query (TanStack) na equipe — estratégia de cache unificada e redução de lógica assíncrona duplicada na aplicação principal do Magalu.',
      en: "• Collaboratively helped the team achieve 92% test coverage with Jest + RTL on the main project — the milestone that unlocked the company's continuous delivery pipeline and became an internal quality benchmark.\n• High-scale micro-frontend applications architected and integrated into Magalu's unified platform, establishing client-side orchestration standards, secure state sharing, and automated release workflows via Git Flow and Conventional Commits.\n• Introduced unit tests and an automated deployment pipeline to a legacy project with zero coverage, shrinking release times from 2 days (manual) to just 1 hour with zero regressions.\n• Spearheaded release pipeline automation using Git Flow and Conventional Commits, integrating design system flows mapped in Figma, unlocking frequent and safe production deployments (Continuous Delivery).\n• Standardized server-state data fetching with React Query (TanStack) across the team — unified cache strategy and reduced duplicated async logic in the main Magalu application.",
    },
  },
  {
    id: 'job-5',
    year: {
      pt: 'agosto 2017 – janeiro 2020 · Uberlândia, MG',
      en: 'August 2017 – January 2020 · Uberlândia, Brazil',
    },
    role: {
      pt: 'Desenvolvedor Full-Stack (Vue/TypeScript/Node)',
      en: 'Full-Stack Engineer (Vue/TypeScript/Node)',
    },
    company: 'Vitta',
    description: {
      pt: '• Vi-Ui criado e liderado como projeto open source: biblioteca de componentes Vue que virou a base do design system da empresa.\n• Design system interno desenvolvido no Figma e codificado para unificar a linguagem visual entre as aplicações — menos inconsistência de UI, mais velocidade para novas features.\n• Microserviço Node + Express + Puppeteer que centraliza a geração de documentos imprimíveis de toda a plataforma, usado em 100% dos fluxos clínicos por médicos e pacientes.\n• API Node + TypeScript para retorno de registros médicos em conformidade com a LGPD — privacidade de dados garantida antes mesmo da lei entrar em vigor.\n• Modelagem e otimização de consultas relacionais em banco de dados PostgreSQL para o microsserviço clínico, reduzindo tempos de resposta de rotas em até 30%.\n• Otimização técnica do portal institucional da Vitta para mecanismos de busca (SEO) e Core Web Vitals, implementando renderização no lado do servidor (SSR) em Vue, semântica HTML estrita e dados estruturados, resultando em aumento substancial do tráfego orgânico.\n• Vi-Ui documentado com Storybook — catálogo interativo de componentes que serviu como referência do time de design e facilitou a contribuição open source.',
      en: "• Created and led Vi-Ui, an open source Vue component library — the foundation the company's design system was built on.\n• Internal design system developed in Figma and coded to unify visual language across all company applications: less UI inconsistency, faster feature delivery.\n• Node + Express + Puppeteer microservice built to centralize printable document generation across the platform — used in 100% of clinical workflows by doctors and patients.\n• Node + TypeScript API for medical record retrieval built in compliance with Brazil's LGPD (GDPR equivalent), ensuring data privacy protections were in place ahead of enforcement.\n• Modeled and optimized complex relational queries in PostgreSQL for the clinical microservice, reducing route response latency by up to 30%.\n• Technical optimization of Vitta's corporate portal for search engines (SEO) and Core Web Vitals, implementing Server-Side Rendering (SSR) in Vue, strict HTML semantics, and structured data, resulting in a substantial increase in organic traffic.\n• Vi-Ui documented with Storybook — interactive component catalog used as the design team's reference and a key resource for open source contributions.",
    },
  },
  {
    id: 'job-6',
    year: {
      pt: 'abril 2012 – julho 2017 · Uberlândia, MG',
      en: 'April 2012 – July 2017 · Uberlândia, Brazil',
    },
    role: {
      pt: 'Desenvolvedor Front-End Senior',
      en: 'Senior Front-End Engineer',
    },
    company: 'LuxControl Automação Residencial',
    description: {
      pt: '• 5 anos liderando o front-end de um sistema embarcado para automação residencial, em ambiente sem internet e com restrições severas de performance e segurança.\n• Interface 100% em conformidade com WCAG, acessível a todos os perfis de usuários independente de dispositivo assistivo.\n• React e consumo de APIs REST introduzidos no sistema legado sem interromper o serviço para clientes já em produção.\n• Desenvolvimento de um mecanismo customizado de cache local no client-side para mitigar latência de rede no hardware embarcado sem internet.\n• Otimização do site institucional da LuxControl focado em SEO e índices do Core Web Vitals (LCP, FID, CLS), elevando a pontuação no Google Lighthouse para acima de 95% e expandindo a presença digital da marca.',
      en: "• 5 years leading front-end development for an embedded home automation system — air-gapped environment, strict performance constraints, no room for deployment mistakes.\n• Full WCAG compliance maintained throughout the product, accessible to all user profiles regardless of assistive device.\n• React and REST API consumption introduced to the legacy system without interrupting service for customers already running in production.\n• Engineered a custom client-side local caching mechanism to mitigate network latency issues within the air-gapped home automation hardware.\n• Optimized LuxControl's corporate website focusing on SEO and Core Web Vitals indices (LCP, FID, CLS), boosting Google Lighthouse scores above 95% and expanding the brand's digital presence.",
    },
  },
]
