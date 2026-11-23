import type { Dict } from './en';

export const pt = {
  a11y: {
    skip: 'Pular para o conteúdo',
  },
  nav: {
    label: 'Principal',
    work: 'Trabalhos',
    contact: 'Contato',
    resume: 'Currículo',
    open: 'Abrir menu',
    close: 'Fechar menu',
    switchLabel: 'Ler em português',
    notTranslated: '(início — esta página não está em português)',
  },
  footer: {
    location: 'Florianópolis, Brasil',
    email: 'E-mail',
  },
  work: {
    caseStudy: 'Estudo de caso',
    back: 'Todos os projetos',
    role: 'Papel',
    period: 'Período',
    stack: 'Stack',
    links: 'Links',
  },
  workIndex: {
    title: 'Projetos',
    intro: 'Estudos de caso de produtos que construí e lancei, do problema à produção.',
    metaTitle: 'Projetos — Otavio Silva',
    metaDescription: 'Estudos de caso de Otavio Silva, Product Engineer: decisões de produto e engenharia, abordagem e resultados.',
  },
  home: {
    role: 'Product Engineer',
    location: 'Florianópolis, Brasil',
    headline: 'Transformo problemas complexos em produtos digitais bem construídos.',
    lede: 'Sou Product Engineer com mais de 10 anos de experiência desenvolvendo software escalável, criando experiências digitais e resolvendo desafios complexos de engenharia. Combino uma base sólida em frontend com visão full-stack, pensamento de produto e workflows assistidos por IA.',
    ctaWork: 'Ver trabalhos selecionados',
    ctaResume: 'Ver currículo',
    mapLabel: 'Diagrama de como trabalho: do problema, passando por usuários e uma decisão de produto, até construir, entregar e medir.',
    map: ['problema', 'usuários', 'decisão', 'construir', 'entregar', 'medir'],
    workTitle: 'Trabalhos selecionados',
    readCase: 'Ler o estudo de caso',
    caseSoon: 'Estudo de caso em breve',
    projects: {
      blockdaemon: {
        title: 'Blockdaemon',
        summary:
          'Plataforma de infraestrutura blockchain para instituições. Construí fluxos de checkout e assinatura e dashboards de staking, liderei a atualização do design system e a migração do React 17 para o 19, e liderei uma iniciativa de performance que reduziu o bundle JavaScript de entrada em mais de 80%.',
        role: 'Front-end, depois Senior Front-end Engineer · 2021–2026',
        tags: ['React', 'TypeScript', 'Design systems', 'Performance web', 'Checkout'],
      },
      'mercado-envios': {
        title: 'Mercado Envios',
        summary:
          'Ferramentas internas de armazém para a operação logística do Mercado Livre. Projetei serviços BFF, documentei fluxos de dados em RFCs e contribuí para mais de 450 releases em produção em micro-frontends.',
        role: 'Front-end Engineer · 2020–2021',
        tags: ['React', 'TypeScript', 'BFF', 'Micro-frontends', 'RFCs'],
      },
    },
    philosophyTitle: 'Como trabalho',
    pillars: [
      { title: 'Pensamento de produto', body: 'Entender usuários, problemas, restrições e contexto de negócio antes de escolher uma solução.' },
      { title: 'Engenharia bem feita', body: 'Arquitetura, performance, qualidade, manutenibilidade e experiência de desenvolvimento.' },
      { title: 'Workflows com IA', body: 'Agentes e automação aumentam a alavancagem da engenharia. Julgamento e qualidade continuam humanos.' },
      { title: 'Ownership de ponta a ponta', body: 'Descoberta, definição de produto, implementação, deploy, medição e iteração.' },
    ],
    focusTitle: 'Foco atual',
    focusIntro: 'No que estou investindo meu tempo agora.',
    focus: ['Engenharia de software assistida por IA', 'Workflows de desenvolvimento com agentes', 'Product engineering', 'Experiência de desenvolvimento', 'Arquitetura de sistemas'],
    contactTitle: 'Contato',
    contactBody: 'Está construindo um produto e precisa de alguém que cuide dele do problema à produção? Quero saber mais.',
    contactEmail: 'Mande um e-mail',
  },
  meta: {
    title: 'Otavio Silva — Product Engineer',
    description:
      'Otavio Silva é Product Engineer em Florianópolis, Brasil, e constrói produtos digitais com base sólida em frontend e visão full-stack.',
  },
} satisfies Dict;
