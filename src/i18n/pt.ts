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
  contactPage: {
    metaTitle: 'Contato — Otavio Silva',
    metaDescription: 'Fale com Otavio Silva, Product Engineer em Florianópolis, Brasil: e-mail, LinkedIn, GitHub e currículo.',
  },
  about: {
    metaTitle: 'Sobre — Otavio Silva',
    metaDescription: 'Otavio Silva é Product Engineer em Florianópolis, com mais de 10 anos construindo produtos web: hoje na Fugro, antes na Blockdaemon e no Mercado Livre.',
    title: 'Sobre',
    intro: [
      'Sou Product Engineer com mais de 10 anos de experiência construindo produtos web. Minha base é React e TypeScript, e cuido do full stack em volta: APIs, infraestrutura, deploy e medição.',
      'Hoje trabalho na Fugro, depois de passar pela Blockdaemon e pelo Mercado Livre. Por conta própria, projetei, construí e mantenho o terral.surf, uma previsão de surf para Florianópolis.',
      'Uso fluxos de trabalho com IA e agentes (Claude Code, Codex, MCP) para ir mais rápido. O julgamento e o padrão de qualidade continuam comigo.',
    ],
    nowTitle: 'Agora',
    timelineTitle: 'Experiência',
    educationTitle: 'Formação',
    designSystemTitle: 'Blockdaemon Design System',
    designSystemBody:
      'O design system interno da Blockdaemon, construído sobre o Mantine 8 com uma nova identidade visual criada por uma agência de design externa. Liderei a atualização do Mantine v6 para o v8: temas, sobrescritas de componentes, design tokens, temas claro e escuro, e documentação com padrões de uso e exemplos ao vivo. Ele é usado em todos os produtos web da Blockdaemon.',
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
