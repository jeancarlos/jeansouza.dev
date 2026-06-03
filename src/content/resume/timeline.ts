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
  accomplishments: Accomplishment[]
  selectedSeniorFront?: Accomplishment[]
}

export const timeline: TimelineEntry[] = [
  {
    id: 'zydon',
    year: {
      pt: 'outubro 2024 – março 2026 · Uberlândia, MG',
      en: 'October 2024 – March 2026 · Uberlândia, Brazil',
    },
    role: {
      pt: 'Desenvolvedor Front-End Senior',
      en: 'Senior Front-End Engineer',
    },
    company: 'Zydon',
    accomplishments: [
      {
        tags: ['testing', 'micro-frontends', 'architecture', 'coverage'],
        pt: 'Suíte de testes criada do zero num ambiente multi-repo de micro-frontends: 70% de cobertura total onde antes não existia nenhuma.',
        en: 'Built the testing suite from scratch across a multi-repo micro-frontend environment — 70% total coverage where none had existed before.',
      },
      {
        tags: ['cicd', 'optimization', 'metrics', 'observability'],
        pt: 'Pipeline de CI otimizado: tempo de build caiu de 1 hora para 20 minutos (redução de 67%), com observabilidade adicionada via instrumentação de logs e métricas.',
        en: 'CI pipeline optimized: build time dropped from 1 hour to 20 minutes (67% reduction), with observability added through log and metric instrumentation.',
      },
      {
        tags: ['quality', 'process', 'code-review', 'automation'],
        pt: 'Taxa de regressão de bugs caiu de ~25% para abaixo de 5% — padronização de code reviews e validações automáticas de CI em pull requests.',
        en: 'Bug regression rate dropped from ~25% to below 5% through standardized code reviews and automated CI validation on every pull request.',
      },
      {
        tags: ['ai', 'tools', 'productivity', 'workflows'],
        pt: 'Introdução de workflows com IA (Claude Code, Windsurf, Codex) no processo do time: menos retrabalho, ciclos de revisão mais curtos e entregas mais confiáveis.',
        en: 'Introduced AI-assisted workflows (Claude Code, Windsurf, Codex) across the team: less rework, faster review cycles, more reliable releases.',
      },
      {
        tags: ['aws', 'cloud', 'cicd'],
        pt: 'Infraestrutura e pipelines de CI/CD implantados e mantidos no provedor de nuvem AWS.',
        en: 'Infrastructure and CI/CD pipelines deployed and maintained on AWS.',
      },
      {
        tags: ['nextjs', 'react', 'redux', 'observability', 'performance', 'figma'],
        pt: 'Refatoração crítica da arquitetura de estados utilizando Redux e hooks customizados em Next.js a partir de especificações no Figma, reduzindo o consumo de memória client-side e otimizando os índices de Core Web Vitals do portal principal.',
        en: 'Executed critical state management refactoring using Redux and Next.js custom hooks from Figma specs, lowering client-side memory footprint and optimizing the portal\'s Core Web Vitals indices.',
      },
      {
        tags: ['micro-frontends', 'architecture', 'decoupling', 'performance'],
        pt: 'Modelagem e desacoplamento de micro-frontends em um ecossistema multi-repositório na Zydon, estabelecendo contratos de comunicação agnósticos e garantindo a autonomia completa de deploy para diferentes squads.',
        en: 'Modeled and decoupled micro-frontends within a multi-repository ecosystem at Zydon, establishing agnostic communication contracts and securing total deployment autonomy for multiple product squads.',
      }
    ],
    selectedSeniorFront: [
      {
        tags: ['nextjs', 'react', 'redux', 'observability', 'performance', 'figma'],
        pt: 'Refatoração crítica da arquitetura de estados utilizando Redux e hooks customizados em Next.js a partir de especificações no Figma, reduzindo o consumo de memória client-side e otimizando os índices de Core Web Vitals do portal principal.',
        en: 'Executed critical state management refactoring using Redux and Next.js custom hooks from Figma specs, lowering client-side memory footprint and optimizing the portal\'s Core Web Vitals indices.',
      },
      {
        tags: ['testing', 'micro-frontends', 'architecture', 'coverage'],
        pt: 'Suíte de testes criada do zero num ambiente multi-repo de micro-frontends: 70% de cobertura total onde antes não existia nenhuma.',
        en: 'Built the testing suite from scratch across a multi-repo micro-frontend environment — 70% total coverage where none had existed before.',
      },
      {
        tags: ['micro-frontends', 'architecture', 'decoupling', 'performance'],
        pt: 'Modelagem e desacoplamento de micro-frontends em um ecossistema multi-repositório na Zydon, estabelecendo contratos de comunicação agnósticos e garantindo a autonomia completa de deploy para diferentes squads.',
        en: 'Modeled and decoupled micro-frontends within a multi-repository ecosystem at Zydon, establishing agnostic communication contracts and securing total deployment autonomy for multiple product squads.',
      }
    ],
  },
  {
    id: 'mutant',
    year: {
      pt: 'janeiro 2024 – agosto 2024 · São Paulo, SP',
      en: 'January 2024 – August 2024 · São Paulo, Brazil',
    },
    role: {
      pt: 'Desenvolvedor Front-End Senior (TypeScript)',
      en: 'Senior Front-End Engineer (TypeScript)',
    },
    company: 'Mutant',
    accomplishments: [
      {
        tags: ['web-components', 'lit', 'architecture', 'vivo', 'micro-frontends'],
        pt: 'Liderança técnica da equipe na criação de uma biblioteca de Web Components (Lit) para o cliente Vivo — interoperável entre Angular e React em arquitetura de micro-frontends, sem necessidade de reescritas por framework.',
        en: 'Led the team in building a Web Components library (Lit) for Vivo, one of Brazil\'s largest telcos — fully interoperable across Angular and React in a micro-frontend architecture, eliminating per-framework rewrites.',
      },
      {
        tags: ['accessibility', 'wcag', 'compliance', 'legal'],
        pt: '100% dos componentes em conformidade WCAG 2.1 AA: biblioteca acessível a tecnologias assistivas, reduzindo o risco legal do cliente.',
        en: '100% of components shipped WCAG 2.1 AA-compliant, making the entire library accessible to assistive technologies and reducing the client\'s legal exposure.',
      },
      {
        tags: ['accessibility', 'wcag', 'design-system', 'web-components', 'lit', 'figma'],
        pt: 'Liderança na otimização e arquitetura da biblioteca de Web Components baseada em designs no Figma para torná-la 100% agnóstica, permitindo a integração direta de componentes de React para Angular de forma transparente, demonstrando conhecimento profundo de ambas as bibliotecas.',
        en: 'Led the optimization and architecture of the Web Components library based on Figma layouts to make it 100% framework-agnostic, enabling direct, seamless component integration from React to Angular based on deep internal knowledge of both libraries.',
      }
    ],
    selectedSeniorFront: [
      {
        tags: ['accessibility', 'wcag', 'design-system', 'web-components', 'lit', 'figma'],
        pt: 'Liderança na otimização e arquitetura da biblioteca de Web Components baseada em designs no Figma para torná-la 100% agnóstica, permitindo a integração direta de componentes de React para Angular de forma transparente, demonstrando conhecimento profundo de ambas as bibliotecas.',
        en: 'Led the optimization and architecture of the Web Components library based on Figma layouts to make it 100% framework-agnostic, enabling direct, seamless component integration from React to Angular based on deep internal knowledge of both libraries.',
      },
      {
        tags: ['web-components', 'lit', 'architecture', 'vivo', 'micro-frontends'],
        pt: 'Liderança técnica da equipe na criação de uma biblioteca de Web Components (Lit) para o cliente Vivo — interoperável entre Angular e React em arquitetura de micro-frontends, sem necessidade de reescritas por framework.',
        en: 'Led the team in building a Web Components library (Lit) for Vivo, one of Brazil\'s largest telcos — fully interoperable across Angular and React in a micro-frontend architecture, eliminating per-framework rewrites.',
      },
      {
        tags: ['accessibility', 'wcag', 'compliance', 'legal'],
        pt: '100% dos componentes em conformidade WCAG 2.1 AA: biblioteca acessível a tecnologias assistivas, reduzindo o risco legal do cliente.',
        en: '100% of components shipped WCAG 2.1 AA-compliant, making the entire library accessible to assistive technologies and reducing the client\'s legal exposure.',
      }
    ],
  },
  {
    id: 'runrunit',
    year: {
      pt: 'agosto 2022 – outubro 2023 · São Paulo, SP',
      en: 'August 2022 – October 2023 · São Paulo, Brazil',
    },
    role: {
      pt: 'Desenvolvedor Front-End Senior (React)',
      en: 'Senior Front-End Engineer (React)',
    },
    company: 'Runrun.it',
    accomplishments: [
      {
        tags: ['react', 'hooks', 'backbone', 'refactoring'],
        pt: 'Ferramenta de ações em massa desenvolvida com React e hooks customizados, adotada em múltiplos fluxos críticos do produto — hooks abstraíam o legado em Backbone para devs novos não precisarem aprender a stack antiga.',
        en: 'Built the bulk-actions tool used across multiple critical flows of the main product, with React and custom hooks abstracting the legacy Backbone integration so new engineers didn\'t need to learn the old stack.',
      },
      {
        tags: ['migration', 'backbone', 'react', 'maintenance', 'onboarding'],
        pt: 'Migração de módulos Backbone + Marionette para React: onboarding mais rápido para devs novos, custo de manutenção reduzido, stack mais sustentável.',
        en: 'Backbone + Marionette modules migrated to React: faster onboarding, lower maintenance cost, more sustainable architecture.',
      },
      {
        tags: ['standards', 'eslint', 'code-review', 'architecture'],
        pt: 'Padrões de qualidade estabelecidos (ESLint, code review, arquitetura de hooks) que o time continuou usando depois da minha saída.',
        en: 'Code quality standards established (ESLint, review guidelines, hook architecture) that the team kept using after I left.',
      },
      {
        tags: ['migration', 'react', 'webpack', 'refactoring', 'performance', 'figma'],
        pt: 'Arquitetura e implementação de uma integração nativa e transparente, a partir de designs no Figma, entre os novos módulos React e a base legada em Backbone/Marionette usando conhecimento profundo de Vanilla JavaScript e React, isolando o legado para que novos desenvolvedores pudessem produzir sem curva de aprendizado na stack antiga.',
        en: 'Architected and implemented a seamless native integration from Figma specifications between React components and the legacy Backbone/Marionette codebase utilizing deep JavaScript and React expertise, abstracting old layers so new hires could ship code without learning the legacy stack.',
      }
    ],
    selectedSeniorFront: [
      {
        tags: ['migration', 'react', 'webpack', 'refactoring', 'performance', 'figma'],
        pt: 'Arquitetura e implementação de uma integração nativa e transparente, a partir de designs no Figma, entre os novos módulos React e a base legada em Backbone/Marionette usando conhecimento profundo de Vanilla JavaScript e React, isolando o legado para que novos desenvolvedores pudessem produzir sem curva de aprendizado na stack antiga.',
        en: 'Architected and implemented a seamless native integration from Figma specifications between React components and the legacy Backbone/Marionette codebase utilizing deep JavaScript and React expertise, abstracting old layers so new hires could ship code without learning the legacy stack.',
      },
      {
        tags: ['react', 'hooks', 'backbone', 'refactoring'],
        pt: 'Ferramenta de ações em massa desenvolvida com React e hooks customizados, adotada em múltiplos fluxos críticos do produto — hooks abstraíam o legado em Backbone para devs novos não precisarem aprender a stack antiga.',
        en: 'Built the bulk-actions tool used across multiple critical flows of the main product, with React and custom hooks abstracting the legacy Backbone integration so new engineers didn\'t need to learn the old stack.',
      },
      {
        tags: ['migration', 'backbone', 'react', 'maintenance', 'onboarding'],
        pt: 'Migração de módulos Backbone + Marionette para React: onboarding mais rápido para devs novos, custo de manutenção reduzido, stack mais sustentável.',
        en: 'Backbone + Marionette modules migrated to React: faster onboarding, lower maintenance cost, more sustainable architecture.',
      }
    ],
  },
  {
    id: 'luizalabs',
    year: {
      pt: 'janeiro 2020 – junho 2022 · Uberlândia, MG',
      en: 'January 2020 – June 2022 · Uberlândia, Brazil',
    },
    role: {
      pt: 'Desenvolvedor Front-End Senior (React/TypeScript)',
      en: 'Senior Front-End Engineer (React/TypeScript)',
    },
    company: 'Luizalabs',
    accomplishments: [
      {
        tags: ['testing', 'jest', 'rtl', 'coverage', 'continuous-delivery'],
        pt: 'Liderança colaborativa que ajudou a equipe a atingir 92% de cobertura de testes com Jest + RTL no projeto principal — o número que desbloqueou a adoção do pipeline de continuous delivery da empresa e virou referência interna.',
        en: 'Collaboratively helped the team achieve 92% test coverage with Jest + RTL on the main project — the milestone that unlocked the company\'s continuous delivery pipeline and became an internal quality benchmark.',
      },
      {
        tags: ['micro-frontends', 'gitflow', 'conventional-commits', 'ecommerce'],
        pt: 'Micro-frontends de alta escala arquitetados e integrados à plataforma unificada do Magalu, estabelecendo padrões de orquestração no client-side, compartilhamento de estado seguro e fluxos automatizados com Git Flow e Conventional Commits.',
        en: 'High-scale micro-frontend applications architected and integrated into Magalu\'s unified platform, establishing client-side orchestration standards, secure state sharing, and automated release workflows via Git Flow and Conventional Commits.',
      },
      {
        tags: ['legacy', 'testing', 'automation', 'regression'],
        pt: 'Projeto legado sem cobertura recebeu suíte de testes unitários e pipeline de deploy automatizado, reduzindo o tempo de release de 2 dias (manual) para apenas 1 hora com zero regressões.',
        en: 'Introduced unit tests and an automated deployment pipeline to a legacy project with zero coverage, shrinking release times from 2 days (manual) to just 1 hour with zero regressions.',
      },
      {
        tags: ['micro-frontends', 'ci-cd', 'automation', 'conventional-commits', 'figma'],
        pt: 'Liderança na automação do pipeline de release utilizando Git Flow e Conventional Commits, integrando fluxos de design system mapeados no Figma e permitindo deploys frequentes e seguros em produção (Continuous Delivery).',
        en: 'Spearheaded release pipeline automation using Git Flow and Conventional Commits, integrating design system flows mapped in Figma, unlocking frequent and safe production deployments (Continuous Delivery).',
      }
    ],
    selectedSeniorFront: [
      {
        tags: ['testing', 'jest', 'rtl', 'coverage', 'continuous-delivery'],
        pt: 'Liderança colaborativa que ajudou a equipe a atingir 92% de cobertura de testes com Jest + RTL no projeto principal — o número que desbloqueou a adoção do pipeline de continuous delivery da empresa e virou referência interna.',
        en: 'Collaboratively helped the team achieve 92% test coverage with Jest + RTL on the main project — the milestone that unlocked the company\'s continuous delivery pipeline and became an internal quality benchmark.',
      },
      {
        tags: ['micro-frontends', 'ci-cd', 'automation', 'conventional-commits', 'figma'],
        pt: 'Liderança na automação do pipeline de release utilizando Git Flow e Conventional Commits, integrando fluxos de design system mapeados no Figma e permitindo deploys frequentes e seguros em produção (Continuous Delivery).',
        en: 'Spearheaded release pipeline automation using Git Flow and Conventional Commits, integrating design system flows mapped in Figma, unlocking frequent and safe production deployments (Continuous Delivery).',
      },
      {
        tags: ['legacy', 'testing', 'automation', 'regression'],
        pt: 'Projeto legado sem cobertura recebeu suíte de testes unitários e pipeline de deploy automatizado, reduzindo o tempo de release de 2 dias (manual) para apenas 1 hora com zero regressões.',
        en: 'Introduced unit tests and an automated deployment pipeline to a legacy project with zero coverage, shrinking release times from 2 days (manual) to just 1 hour with zero regressions.',
      }
    ],
  },
  {
    id: 'vitta',
    year: {
      pt: 'agosto 2017 – janeiro 2020 · Uberlândia, MG',
      en: 'August 2017 – January 2020 · Uberlândia, Brazil',
    },
    role: {
      pt: 'Desenvolvedor Full-Stack (Vue/TypeScript/Node)',
      en: 'Full-Stack Engineer (Vue/TypeScript/Node)',
    },
    company: 'Vitta',
    accomplishments: [
      {
        tags: ['vue', 'open-source', 'ui-library', 'design-system'],
        pt: 'Vi-Ui criado e liderado como projeto open source: biblioteca de componentes Vue que virou a base do design system da empresa.',
        en: 'Created and led Vi-Ui, an open source Vue component library — the foundation the company\'s design system was built on.',
      },
      {
        tags: ['design-system', 'consistency', 'velocity', 'figma'],
        pt: 'Design system interno desenvolvido no Figma e codificado para unificar a linguagem visual entre as aplicações — menos inconsistência de UI, mais velocidade para novas features.',
        en: 'Internal design system developed in Figma and coded to unify visual language across all company applications: less UI inconsistency, faster feature delivery.',
      },
      {
        tags: ['node', 'puppeteer', 'pdf-generation', 'microservices'],
        pt: 'Microserviço Node + Express + Puppeteer que centraliza a geração de documentos imprimíveis de toda a plataforma, usado em 100% dos fluxos clínicos por médicos e pacientes.',
        en: 'Node + Express + Puppeteer microservice built to centralize printable document generation across the platform — used in 100% of clinical workflows by doctors and patients.',
      },
      {
        tags: ['node', 'typescript', 'lgpd', 'security', 'privacy'],
        pt: 'API Node + TypeScript para retorno de registros médicos em conformidade com a LGPD — privacidade de dados garantida antes mesmo da lei entrar em vigor.',
        en: 'Node + TypeScript API for medical record retrieval built in compliance with Brazil\'s LGPD (GDPR equivalent), ensuring data privacy protections were in place ahead of enforcement.',
      },
      {
        tags: ['node', 'express', 'microservices', 'postgresql', 'security'],
        pt: 'Modelagem e otimização de consultas relacionais em banco de dados PostgreSQL para o microsserviço clínico, reduzindo tempos de resposta de rotas em até 30%.',
        en: 'Modeled and optimized complex relational queries in PostgreSQL for the clinical microservice, reducing route response latency by up to 30%.',
      },
      {
        tags: ['seo', 'performance', 'core-web-vitals', 'optimization', 'vue'],
        pt: 'Otimização técnica do portal institucional da Vitta para mecanismos de busca (SEO) e Core Web Vitals, implementando renderização no lado do servidor (SSR) em Vue, semântica HTML estrita e dados estruturados, resultando em aumento substancial do tráfego orgânico.',
        en: 'Technical optimization of Vitta\'s corporate portal for search engines (SEO) and Core Web Vitals, implementing Server-Side Rendering (SSR) in Vue, strict HTML semantics, and structured data, resulting in a substantial increase in organic traffic.',
      }
    ],
    selectedSeniorFront: [
      {
        tags: ['seo', 'performance', 'core-web-vitals', 'optimization', 'vue'],
        pt: 'Otimização técnica do portal institucional da Vitta para mecanismos de busca (SEO) e Core Web Vitals, implementando renderização no lado do servidor (SSR) em Vue, semântica HTML estrita e dados estruturados, resultando em aumento substancial do tráfego orgânico.',
        en: 'Technical optimization of Vitta\'s corporate portal for search engines (SEO) and Core Web Vitals, implementing Server-Side Rendering (SSR) in Vue, strict HTML semantics, and structured data, resulting in a substantial increase in organic traffic.',
      },
      {
        tags: ['design-system', 'consistency', 'velocity', 'figma'],
        pt: 'Design system interno desenvolvido no Figma e codificado para unificar a linguagem visual entre as aplicações — menos inconsistência de UI, mais velocidade para novas features.',
        en: 'Internal design system developed in Figma and coded to unify visual language across all company applications: less UI inconsistency, faster feature delivery.',
      },
      {
        tags: ['vue', 'open-source', 'ui-library', 'design-system'],
        pt: 'Vi-Ui criado e liderado como projeto open source: biblioteca de componentes Vue que virou a base do design system da empresa.',
        en: 'Created and led Vi-Ui, an open source Vue component library — the foundation the company\'s design system was built on.',
      }
    ],
  },
  {
    id: 'luxcontrol',
    year: {
      pt: 'abril 2012 – julho 2017 · Uberlândia, MG',
      en: 'April 2012 – July 2017 · Uberlândia, Brazil',
    },
    role: {
      pt: 'Desenvolvedor Front-End Senior',
      en: 'Senior Front-End Engineer',
    },
    company: 'LuxControl Automação Residencial',
    accomplishments: [
      {
        tags: ['embedded', 'performance', 'security', 'home-automation'],
        pt: '5 anos liderando o front-end de um sistema embarcado para automação residencial, em ambiente sem internet e com restrições severas de performance e segurança.',
        en: '5 years leading front-end development for an embedded home automation system — air-gapped environment, strict performance constraints, no room for deployment mistakes.',
      },
      {
        tags: ['accessibility', 'wcag', 'compliance'],
        pt: 'Interface 100% em conformidade com WCAG, acessível a todos os perfis de usuários independente de dispositivo assistivo.',
        en: 'Full WCAG compliance maintained throughout the product, accessible to all user profiles regardless of assistive device.',
      },
      {
        tags: ['react', 'api', 'integration', 'migration'],
        pt: 'React e consumo de APIs REST introduzidos no sistema legado sem interromper o serviço para clientes já em produção.',
        en: 'React and REST API consumption introduced to the legacy system without interrupting service for customers already running in production.',
      },
      {
        tags: ['embedded', 'performance', 'react', 'api', 'rest'],
        pt: 'Desenvolvimento de um mecanismo customizado de cache local no client-side para mitigar latência de rede no hardware embarcado sem internet.',
        en: 'Engineered a custom client-side local caching mechanism to mitigate network latency issues within the air-gapped home automation hardware.',
      },
      {
        tags: ['seo', 'core-web-vitals', 'optimization', 'performance'],
        pt: 'Otimização do site institucional da LuxControl focado em SEO e índices do Core Web Vitals (LCP, FID, CLS), elevando a pontuação no Google Lighthouse para acima de 95% e expandindo a presença digital da marca.',
        en: 'Optimized LuxControl\'s corporate website focusing on SEO and Core Web Vitals indices (LCP, FID, CLS), boosting Google Lighthouse scores above 95% and expanding the brand\'s digital presence.',
      }
    ],
    selectedSeniorFront: [
      {
        tags: ['seo', 'core-web-vitals', 'optimization', 'performance'],
        pt: 'Otimização do site institucional da LuxControl focado em SEO e índices do Core Web Vitals (LCP, FID, CLS), elevando a pontuação no Google Lighthouse para acima de 95% e expandindo a presença digital da marca.',
        en: 'Optimized LuxControl\'s corporate website focusing on SEO and Core Web Vitals indices (LCP, FID, CLS), boosting Google Lighthouse scores above 95% and expanding the brand\'s digital presence.',
      },
      {
        tags: ['accessibility', 'wcag', 'compliance'],
        pt: 'Interface 100% em conformidade com WCAG, acessível a todos os perfis de usuários independente de dispositivo assistivo.',
        en: 'Full WCAG compliance maintained throughout the product, accessible to all user profiles regardless of assistive device.',
      },
      {
        tags: ['embedded', 'performance', 'react', 'api', 'rest'],
        pt: 'Desenvolvimento de um mecanismo customizado de cache local no client-side para mitigar latência de rede no hardware embarcado sem internet.',
        en: 'Engineered a custom client-side local caching mechanism to mitigate network latency issues within the air-gapped home automation hardware.',
      }
    ],
  }
]
