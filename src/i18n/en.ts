export const en = {
  a11y: {
    skip: 'Skip to content',
  },
  nav: {
    label: 'Main',
    work: 'Work',
    contact: 'Contact',
    resume: 'Résumé',
    open: 'Open menu',
    close: 'Close menu',
    switchLabel: 'Read in English',
    notTranslated: '(home — this page is not in English)',
  },
  footer: {
    location: 'Florianópolis, Brazil',
    email: 'Email',
  },
  work: {
    caseStudy: 'Case study',
    back: 'Back to selected work',
    role: 'Role',
    period: 'Period',
    stack: 'Stack',
    links: 'Links',
  },
  home: {
    role: 'Product Engineer',
    location: 'Florianópolis, Brazil',
    headline: 'I turn complex problems into thoughtful digital products.',
    lede: "I'm a Product Engineer with 10+ years of experience building scalable software, crafting user experiences and solving complex engineering challenges. I combine strong frontend foundations with full-stack ownership, product thinking and AI-assisted workflows.",
    ctaWork: 'Explore selected work',
    ctaResume: 'View résumé',
    mapLabel: 'Diagram of how I work: from the problem, through users and a product decision, to building, shipping and measuring.',
    map: ['problem', 'users', 'decision', 'build', 'ship', 'measure'],
    workTitle: 'Selected work',
    readCase: 'Read the case study',
    caseSoon: 'Case study coming soon',
    projects: {
      blockdaemon: {
        title: 'Blockdaemon',
        summary:
          'Institutional blockchain infrastructure platform. I built checkout and subscription flows and staking dashboards, led the design system upgrade and the React 17 to 19 migration, and led a performance initiative that cut the JavaScript entry bundle by more than 80%.',
        role: 'Front-end, then Senior Front-end Engineer · 2021–2026',
        tags: ['React', 'TypeScript', 'Design systems', 'Web performance', 'Checkout'],
      },
      'mercado-envios': {
        title: 'Mercado Envios',
        summary:
          "Internal warehouse tooling for Mercado Livre's logistics operation. I designed BFF services, documented data flows in RFCs and contributed to 450+ production releases across micro-frontends.",
        role: 'Front-end Engineer · 2020–2021',
        tags: ['React', 'TypeScript', 'BFF', 'Micro-frontends', 'RFCs'],
      },
    },
    philosophyTitle: 'How I work',
    pillars: [
      { title: 'Product thinking', body: 'Understand users, problems, constraints and business context before choosing a solution.' },
      { title: 'Engineering craft', body: 'Architecture, performance, quality, maintainability and developer experience.' },
      { title: 'AI-native workflows', body: 'Agents and automation increase engineering leverage. Judgment and quality stay human-owned.' },
      { title: 'End-to-end ownership', body: 'Discovery, product definition, implementation, deployment, measurement and iteration.' },
    ],
    focusTitle: 'Current focus',
    focusIntro: "What I'm spending time on right now.",
    focus: ['AI-assisted software engineering', 'Agentic development workflows', 'Product engineering', 'Developer experience', 'System architecture'],
    contactTitle: 'Contact',
    contactBody: "Building a product and need someone who can own it from problem to production? I'd like to hear about it.",
    contactEmail: 'Email me',
  },
  meta: {
    title: 'Otavio Silva — Product Engineer',
    description:
      'Otavio Silva is a Product Engineer in Florianópolis, Brazil, building thoughtful digital products with strong frontend foundations and full-stack ownership.',
  },
};

export type Dict = typeof en;
