import type { Locale } from '../i18n/types';

// Source for every role and number: the owner's résumé (see docs/superpowers/evidence/about.md).

export interface Role {
  company: string;
  url?: string;
  title: Record<Locale, string>;
  period: Record<Locale, string>; // "June 2026 – present" / "junho de 2026 – atual"
  place: Record<Locale, string>; // "Remote" / "Remoto", "Florianópolis" …
  summary: Record<Locale, string>;
  caseStudy?: 'blockdaemon' | 'mercado-envios';
}

const remote = { en: 'Remote', pt: 'Remoto' };
const frontEnd = { en: 'Front-end Engineer', pt: 'Engenheiro Front-end' };

/** Newest first. */
export const experience: Role[] = [
  {
    company: 'Fugro',
    url: 'https://www.fugro.com',
    title: { en: 'Senior Software Engineer', pt: 'Engenheiro de Software Sênior' },
    period: { en: 'June 2026 – present', pt: 'junho de 2026 – atual' },
    place: remote,
    summary: {
      en: 'A React and TypeScript platform for geotechnical lab test acquisition, processing and reporting, working across the full stack with .NET and PostgreSQL to deliver standards-compliant (ASTM/ISO) engineering workflows.',
      pt: 'Uma plataforma em React e TypeScript para aquisição, processamento e relatórios de ensaios geotécnicos de laboratório, trabalhando no full stack com .NET e PostgreSQL para entregar fluxos de engenharia conforme normas (ASTM/ISO).',
    },
  },
  {
    company: 'Blockdaemon',
    url: 'https://app.blockdaemon.com',
    title: { en: 'Senior Front-end Engineer', pt: 'Engenheiro Front-end Sênior' },
    period: { en: 'March 2024 – April 2026', pt: 'março de 2024 – abril de 2026' },
    place: remote,
    summary: {
      en: 'Led a performance initiative that cut the JavaScript entry bundle by more than 80%, the design system upgrade from Mantine v6 to v8, the move from React 17 to 19 and a new Portfolio product. Interviewed candidates and mentored junior and mid-level engineers.',
      pt: 'Liderei uma iniciativa de performance que reduziu o bundle de entrada de JavaScript em mais de 80%, a atualização do design system do Mantine v6 para o v8, a migração do React 17 para o 19 e um novo produto, Portfolio. Fiz entrevistas técnicas e mentorei engenheiros júnior e pleno.',
    },
    caseStudy: 'blockdaemon',
  },
  {
    company: 'Blockdaemon',
    url: 'https://app.blockdaemon.com',
    title: frontEnd,
    period: { en: 'July 2021 – March 2024', pt: 'julho de 2021 – março de 2024' },
    place: remote,
    summary: {
      en: 'Led checkout and subscription flows for nodes and the API Suite, built staking dashboards and a JSON-schema form builder, rebuilt onboarding on Okta, integrated Contentful and added Playwright and Cypress tests for critical journeys.',
      pt: 'Liderei os fluxos de checkout e assinatura de nodes e da API Suite, construí dashboards de staking e um construtor de formulários a partir de JSON schemas, refiz o onboarding com Okta, integrei o Contentful e criei testes com Playwright e Cypress para as jornadas críticas.',
    },
    caseStudy: 'blockdaemon',
  },
  {
    company: 'Mercado Livre',
    title: frontEnd,
    period: { en: 'September 2020 – July 2021', pt: 'setembro de 2020 – julho de 2021' },
    place: remote,
    summary: {
      en: 'Mercado Envios warehouse tooling: BFF services, data flows documented in RFCs, and contributions to 450+ production releases across micro-frontend applications.',
      pt: 'Ferramentas de armazém do Mercado Envios: serviços BFF, fluxos de dados documentados em RFCs e contribuição para mais de 450 releases em produção em aplicações micro-frontend.',
    },
    caseStudy: 'mercado-envios',
  },
  {
    company: 'Dextra Digital',
    title: frontEnd,
    period: { en: 'August 2019 – August 2020', pt: 'agosto de 2019 – agosto de 2020' },
    place: { en: 'Florianópolis, on-site', pt: 'Florianópolis, presencial' },
    summary: {
      en: 'Responsive web and mobile apps in React and React Native, from high-fidelity prototypes to production, as the direct contact for international clients.',
      pt: 'Aplicações web responsivas e mobile em React e React Native, de protótipos de alta fidelidade à produção, como contato direto de clientes internacionais.',
    },
  },
  {
    company: 'Turtle',
    title: { en: 'Front-end Engineer (Freelance)', pt: 'Engenheiro Front-end (Freelancer)' },
    period: { en: 'May 2019 – June 2020', pt: 'maio de 2019 – junho de 2020' },
    place: remote,
    summary: {
      en: 'Designed and built an iOS app from scratch in React Native.',
      pt: 'Projetei e construí do zero um app iOS em React Native.',
    },
  },
  {
    company: 'GeekHunter',
    url: 'https://www.geekhunter.com.br',
    title: frontEnd,
    period: { en: 'October 2018 – August 2019', pt: 'outubro de 2018 – agosto de 2019' },
    place: { en: 'Florianópolis, on-site', pt: 'Florianópolis, presencial' },
    summary: {
      en: 'Web apps for tech hiring. Architected and launched a developer assessment platform from scratch, which grew to 500+ monthly active IT professionals and raised user satisfaction scores by 25%.',
      pt: 'Aplicações web para contratação em tecnologia. Arquitetei e lancei do zero uma plataforma de avaliação de desenvolvedores, que chegou a mais de 500 profissionais de TI ativos por mês e aumentou em 25% as notas de satisfação dos usuários.',
    },
  },
  {
    company: 'Universidade Federal do Pará',
    title: frontEnd,
    period: { en: 'May 2018 – October 2018', pt: 'maio de 2018 – outubro de 2018' },
    place: { en: 'Belém, on-site', pt: 'Belém, presencial' },
    summary: {
      en: 'New front-end projects, style guides and shared React component libraries; introduced an agile process to the team.',
      pt: 'Novos projetos de front-end, guias de estilo e bibliotecas de componentes React compartilhadas; implantei um processo ágil no time.',
    },
  },
  {
    company: 'Ezpeed',
    title: { en: 'Full-stack Engineer', pt: 'Engenheiro Full-stack' },
    period: { en: 'June 2017 – May 2018', pt: 'junho de 2017 – maio de 2018' },
    place: { en: 'Belém', pt: 'Belém' },
    summary: {
      en: 'Product landing pages and mobile apps; introduced agile practices and helped build a product culture.',
      pt: 'Landing pages de produto e apps mobile; introduzi práticas ágeis e ajudei a construir uma cultura de produto.',
    },
  },
];

export const education: { name: Record<Locale, string>; school: string; year: string }[] = [
  {
    name: { en: 'Postgraduate degree, Software Engineering', pt: 'Pós-graduação em Engenharia de Software' },
    school: 'Rocketseat',
    year: '2026',
  },
  {
    name: { en: 'Degree in Computer Engineering', pt: 'Graduação em Engenharia da Computação' },
    school: 'Universidade Federal do Pará',
    year: '2018',
  },
];
