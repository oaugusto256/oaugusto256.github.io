import type { Dict } from './en';

export const pt = {
  a11y: {
    skip: 'Pular para o conteúdo',
  },
  nav: {
    label: 'Principal',
    work: 'Trabalhos',
    about: 'Sobre',
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
    back: 'Todos os trabalhos',
    role: 'Papel',
    period: 'Período',
    stack: 'Stack',
    links: 'Links',
  },
  workIndex: {
    title: 'Trabalhos',
    intro: 'Estudos de caso de produtos que construí e lancei, do problema à produção.',
    metaTitle: 'Trabalhos — Otavio Silva',
    metaDescription: 'Estudos de caso de Otavio Silva, Product Engineer: decisões de produto e engenharia, abordagem e resultados.',
  },
  contactPage: {
    metaTitle: 'Contato — Otavio Silva',
    metaDescription: 'Fale com Otavio Silva, Product Engineer em Florianópolis, Brasil: e-mail, LinkedIn, GitHub e currículo.',
  },
  about: {
    metaTitle: 'Sobre — Otavio Silva',
    metaDescription: 'Otavio Silva, Product Engineer em Florianópolis: mais de 10 anos construindo produtos web, a maior parte como engenheiro front-end, hoje de ponta a ponta. Atualmente na Fugro.',
    title: 'Sobre',
    intro: [
      'Construo produtos web há mais de 10 anos, a maior parte como engenheiro front-end: React e TypeScript, design systems, performance, fluxos de checkout e assinatura. Hoje trabalho na Fugro, depois de passar pela Blockdaemon e pelo Mercado Livre.',
      'Com o tempo, meu trabalho foi indo em direção ao produto: cuidar de uma funcionalidade do problema à produção, incluindo as APIs, a infraestrutura, o deploy e a medição em volta dela. Por conta própria, projetei, construí e mantenho o terral.surf, uma previsão de surf para Florianópolis, de ponta a ponta.',
      'É esse o trabalho que quero fazer mais: product engineering, do problema do usuário aos números depois do lançamento. Uso fluxos de trabalho com IA e agentes (Claude Code, Codex, MCP) para ir mais rápido; o julgamento e o padrão de qualidade continuam comigo.',
    ],
    nowTitle: 'Agora',
    timelineTitle: 'Experiência',
    educationTitle: 'Formação',
  },
  home: {
    role: 'Product Engineer',
    location: 'Florianópolis, Brasil',
    headline: 'Transformo problemas complexos em produtos digitais bem construídos.',
    lede: 'Construo produtos web há mais de 10 anos, a maior parte como engenheiro front-end. Hoje trabalho de ponta a ponta, como product engineer: do problema e de quem o tem até a API, o deploy e os números, com fluxos de trabalho assistidos por IA para ir mais rápido.',
    ctaWork: 'Ver trabalhos selecionados',
    ctaResume: 'Ver currículo',
    mapLabel: 'Diagrama de como trabalho: do problema, passando por usuários e uma decisão de produto, até construir, entregar e medir.',
    map: ['problema', 'usuários', 'decisão', 'construir', 'entregar', 'medir'],
    workTitle: 'Trabalhos selecionados',
    readCase: 'Ler o estudo de caso',
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
