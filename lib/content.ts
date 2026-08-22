export type ServiceContent = { title: string; text: string };
export type TestimonialContent = { quote: string; name: string; role: string };

export type SiteContent = {
  hero: { eyebrow: string; title: string; body: string; primaryButton: string; secondaryButton: string };
  trust: Array<{ title: string; subtitle: string }>;
  about: { eyebrow: string; title: string; paragraphs: string[] };
  services: { eyebrow: string; title: string; intro: string; items: ServiceContent[] };
  testimonials: { eyebrow: string; title: string; items: TestimonialContent[] };
  cta: { eyebrow: string; title: string; body: string; button: string };
  contact: { eyebrow: string; title: string; body: string; phone: string; email: string };
  footer: { tagline: string; businessName: string; businessDetails: string; legal: string };
};

export const defaultContent: SiteContent = {
  hero: {
    eyebrow: 'Independent investment adviser',
    title: 'Daniel Charles Evans',
    body: 'I offer professional investment advisory services to help individuals grow and safeguard their wealth over time. Through tailored strategy, disciplined execution and a deep understanding of market behaviour, I help you invest with clarity and confidence.',
    primaryButton: 'Book a consultation',
    secondaryButton: 'Get full report',
  },
  trust: [
    { title: 'Independent advice', subtitle: 'Always centred on you' },
    { title: 'Clear communication', subtitle: 'Straightforward advice' },
    { title: 'Long-term thinking', subtitle: 'Guidance for every chapter' },
  ],
  about: {
    eyebrow: 'About me',
    title: 'Thoughtful advice.\nA personal relationship.',
    paragraphs: [
      'I’m Daniel Charles Evans, an independent investment adviser committed to helping individuals and families make informed decisions about their wealth. I believe good advice starts by understanding the person behind the portfolio—your responsibilities, values, ambitions and the life you want your money to support.',
      'My approach combines careful research with practical, measured decision-making. Rather than reacting to short-term market noise, I focus on building resilient portfolios, setting clear expectations and maintaining the discipline required for long-term progress. Every recommendation is explained clearly and shaped around your circumstances.',
      'Whether you are building wealth, approaching retirement, managing a significant financial transition or seeking a second opinion, you can expect attentive service, honest conversation and ongoing guidance as your needs evolve.',
    ],
  },
  services: {
    eyebrow: 'What I do',
    title: 'Advice for every stage\nof your financial life.',
    intro: 'From your first structured plan to the stewardship of established wealth, each service is tailored, transparent and connected to the outcomes that matter to you.',
    items: [
      { title: 'Investment Planning & Portfolio Strategy', text: 'My investment planning process goes beyond selecting individual funds or reacting to short-term market movements. I develop a structured, research-led strategy around your objectives, time horizon, liquidity requirements and tolerance for risk.' },
      { title: 'Retirement Planning & Long-Term Wealth Preservation', text: 'I develop comprehensive strategies focused on preserving and enhancing wealth through structured investment planning, tax-efficient solutions, estate coordination and reliable income generation.' },
      { title: 'Portfolio Review & Strategic Optimisation', text: 'I carry out a detailed assessment of asset allocation, diversification, fees, tax exposure, risk concentration and alignment with your wider financial objectives.' },
      { title: 'Risk Management & Legacy Protection', text: 'I assess market risk, inflation, liquidity needs, income disruption and major life changes, then build coordinated safeguards around your portfolio.' },
    ],
  },
  testimonials: {
    eyebrow: 'Client stories',
    title: 'Trusted advice.\nLasting relationships.',
    items: [
      { quote: 'Daniel took time to understand both our ambitions and our concerns. The strategy he built is thoughtful, easy to follow and has given us genuine confidence about the future.', name: 'Sarah L.', role: 'Business owner' },
      { quote: 'What sets Daniel apart is his ability to make complex decisions feel manageable. He is patient, precise and always explains the reasoning behind every recommendation.', name: 'James T.', role: 'Private client' },
      { quote: 'Daniel brought structure to a portfolio that had become unnecessarily complicated. His calm perspective and long-term discipline have been invaluable through volatile markets.', name: 'Priya K.', role: 'Senior executive' },
      { quote: 'We now understand exactly what our investments are for and how they fit into retirement. Daniel listens carefully, communicates clearly and never makes the process feel rushed.', name: 'Michael & Anne R.', role: 'Retirement clients' },
    ],
  },
  cta: { eyebrow: 'Ready when you are', title: 'Invest with greater clarity.', body: 'Let’s start with a conversation about the future you want to build.', button: 'Schedule an introductory call' },
  contact: { eyebrow: 'Get in touch', title: 'Let’s start a\nconversation.', body: 'Tell me a little about your goals and what you would like help with. I’ll respond personally to arrange a confidential, no-obligation introductory conversation.', phone: '+44 20 7946 0958', email: 'hello@dceadvisory.com' },
  footer: { tagline: 'Independent investment advice,\naligned with your goals.', businessName: 'Daniel Charles Evans Advisory', businessDetails: 'Private investment advisory services\nBy appointment', legal: '© 2026 Daniel Charles Evans Advisory. Investment values can fall as well as rise. Past performance is not a reliable indicator of future results.' },
};

export const mergeContent = (value?: Partial<SiteContent> | null): SiteContent => ({
  ...defaultContent,
  ...value,
  hero: { ...defaultContent.hero, ...value?.hero },
  about: { ...defaultContent.about, ...value?.about },
  services: { ...defaultContent.services, ...value?.services },
  testimonials: { ...defaultContent.testimonials, ...value?.testimonials },
  cta: { ...defaultContent.cta, ...value?.cta },
  contact: { ...defaultContent.contact, ...value?.contact },
  footer: { ...defaultContent.footer, ...value?.footer },
  trust: value?.trust?.length ? value.trust : defaultContent.trust,
});
