export const en = {
  a11y: {
    skip: 'Skip to content',
  },
  nav: {
    label: 'Main',
    work: 'Work',
    about: 'About',
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
    back: 'All work',
    role: 'Role',
    period: 'Period',
    stack: 'Stack',
    links: 'Links',
  },
  workIndex: {
    title: 'Work',
    intro: 'Case studies from products I have built and shipped, from problem to production.',
    metaTitle: 'Work — Otavio Silva',
    metaDescription: 'Case studies by Otavio Silva, Product Engineer: product and engineering decisions, approach and results.',
  },
  contactPage: {
    metaTitle: 'Contact — Otavio Silva',
    metaDescription: 'Get in touch with Otavio Silva, Product Engineer in Florianópolis, Brazil: email, LinkedIn, GitHub and résumé.',
  },
  about: {
    metaTitle: 'About — Otavio Silva',
    metaDescription: 'Otavio Silva is a Product Engineer in Florianópolis, Brazil, with 10+ years building web products: currently at Fugro, previously Blockdaemon and Mercado Livre.',
    title: 'About',
    intro: [
      "I'm a Product Engineer with 10+ years of experience building web products. My foundation is React and TypeScript, and I own the full stack around it: APIs, infrastructure, deployment and measurement.",
      'I work at Fugro today, after Blockdaemon and Mercado Livre. On my own, I designed, built and run terral.surf, a surf forecast for Florianópolis.',
      'I use AI-assisted, agentic workflows (Claude Code, Codex, MCP) to move faster. The judgment and the quality bar stay mine.',
    ],
    nowTitle: 'Now',
    timelineTitle: 'Experience',
    educationTitle: 'Education',
    designSystemTitle: 'Blockdaemon Design System',
    designSystemBody:
      "Blockdaemon's internal design system, built on Mantine 8 with a new visual identity from an external design agency. I led its upgrade from Mantine v6 to v8: theming, component overrides, design tokens, dark and light themes, and documentation with usage patterns and live examples. It is used across Blockdaemon's web products.",
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
