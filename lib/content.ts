export type ServiceContent = { title: string; text: string };
export type TestimonialContent = { quote: string; name: string; role: string };

export type SiteContent = {
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    primaryButton: string;
    secondaryButton: string;
    imageUrl: string;
  };
  trust: Array<{ title: string; subtitle: string }>;
  about: { eyebrow: string; title: string; paragraphs: string[] };
  services: {
    eyebrow: string;
    title: string;
    intro: string;
    items: ServiceContent[];
  };
  testimonials: { eyebrow: string; title: string; items: TestimonialContent[] };
  cta: { eyebrow: string; title: string; body: string; button: string };
  contact: { eyebrow: string; title: string; body: string; email: string };
  footer: {
    tagline: string;
    businessName: string;
    businessDetails: string;
    legal: string;
  };
};

export const defaultContent: SiteContent = {
  hero: {
    eyebrow: "Financial advisor and broker",
    title: "Daniel Charles Evans",
    body: "I offer professional investment advisory services to help individuals grow and safeguard their wealth over time. Through tailored strategy, disciplined execution and a deep understanding of market behaviour, I help you invest with clarity and confidence.",
    primaryButton: "Book a consultation",
    secondaryButton: "Get full report",
    imageUrl: "/daniel-charles-evans.jpeg",
  },
  trust: [
    { title: "Independent advice", subtitle: "Always centred on you" },
    { title: "Clear communication", subtitle: "Straightforward advice" },
    { title: "Long-term thinking", subtitle: "Guidance for every chapter" },
  ],
  about: {
    eyebrow: "About me",
    title: "Thoughtful advice.\nA personal relationship.",
    paragraphs: [
      "I’m Daniel Charles Evans, a financial advisor and broker committed to helping individuals and families make informed decisions about their wealth. I believe good advice starts by understanding the person behind the portfolio: your responsibilities, values, ambitions and the life you want your money to support.",
      "My approach combines careful research with practical, measured decision-making. Rather than reacting to short-term market noise, I focus on building resilient portfolios, setting clear expectations and maintaining the discipline required for long-term progress. Every recommendation is explained clearly and shaped around your circumstances.",
      "Whether you are building wealth, approaching retirement, managing a significant financial transition or seeking a second opinion, you can expect attentive service, honest conversation and ongoing guidance as your needs evolve.",
    ],
  },
  services: {
    eyebrow: "What I do",
    title: "Advice for every stage\nof your financial life.",
    intro:
      "From your first structured plan to the stewardship of established wealth, each service is tailored, transparent and connected to the outcomes that matter to you.",
    items: [
      {
        title: "Retirement Planning",
        text: "Retirement planning involves far more than preparing for a particular age. It is about making sure the financial resources needed to maintain your lifestyle are available throughout every stage of retirement. Through careful preparation and disciplined investing, I create strategies that help clients move confidently from building wealth to generating a dependable, sustainable income. This process includes reviewing retirement accounts, investment portfolios, tax considerations and future income requirements. Every plan is shaped around the client’s individual circumstances, including lifestyle ambitions, expected expenses, healthcare needs and the effect of changing market conditions. By combining a thoughtful investment strategy with tax-efficient withdrawal planning, clients can approach retirement with greater clarity and peace of mind. The aim is to ensure your finances are structured to support lasting stability, flexibility and financial independence.",
      },
      {
        title: "Investment Management",
        text: "Successful investment management requires more than choosing a collection of stocks or funds. It calls for disciplined research, meaningful diversification and a long-term strategy built around each client’s financial objectives and comfort with risk. My approach focuses on creating balanced portfolios designed to pursue consistent growth while managing exposure across asset classes, industries and international markets. Market conditions and wider economic developments are monitored carefully, allowing each portfolio to be reviewed and adjusted when appropriate so that it remains aligned with the client’s long-term direction. Every investment strategy is developed with close attention to risk-adjusted returns, tax efficiency and purposeful asset allocation. This gives clients the opportunity to participate in market growth while maintaining a clear and disciplined framework. The objective is not simply to invest money, but to build a resilient portfolio capable of growing and enduring through a variety of market environments.",
      },
      {
        title: "Wealth Preservation & Legacy Planning",
        text: "Building wealth is only one part of a complete financial journey. Protecting that wealth and arranging for it to pass efficiently to future generations are equally important. Wealth preservation strategies are designed to reduce unnecessary risk, manage tax exposure and create a clear structure for long-term financial security. With careful coordination, clients can position their assets to continue supporting their families, businesses and wider goals well into the future. Legacy planning brings investment strategy together with estate considerations so that wealth can be transferred in a tax-conscious way that reflects the client’s values and intentions. Whether the priority is providing for loved ones, supporting the education of future generations, contributing to meaningful causes or creating an enduring family legacy, thoughtful planning can have a lasting impact. The goal is to ensure that wealth accumulated over a lifetime continues to provide security, opportunity and stability for the people and purposes that matter most.",
      },
      {
        title: "Business Financial Consulting",
        text: "Strong businesses need more than rising revenue. They depend on strategic financial planning, disciplined capital management and informed, forward-looking guidance. My business financial consulting service helps entrepreneurs and business owners organise their finances in ways that support sustainable business growth while also contributing to long-term personal wealth. Drawing on experience with owners across a range of industries, I help clients examine cash flow, improve capital allocation and identify opportunities for efficient reinvestment. Whether the objective is expanding operations, strengthening the company’s financial structure, preparing for succession or connecting business profits to a broader personal investment plan, every recommendation is tailored to the owner’s specific priorities. The purpose is straightforward: to help build a stronger, more resilient business while improving the personal financial position of the individuals whose vision and effort stand behind it.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Client stories",
    title: "Trusted advice.\nLasting relationships.",
    items: [
      {
        quote:
          "Daniel took time to understand both our ambitions and our concerns. The strategy he built is thoughtful, easy to follow and has given us genuine confidence about the future.",
        name: "Sarah L.",
        role: "Business owner",
      },
      {
        quote:
          "What sets Daniel apart is his ability to make complex decisions feel manageable. He is patient, precise and always explains the reasoning behind every recommendation.",
        name: "James T.",
        role: "Private client",
      },
      {
        quote:
          "Daniel brought structure to a portfolio that had become unnecessarily complicated. His calm perspective and long-term discipline have been invaluable through volatile markets.",
        name: "Priya K.",
        role: "Senior executive",
      },
      {
        quote:
          "We now understand exactly what our investments are for and how they fit into retirement. Daniel listens carefully, communicates clearly and never makes the process feel rushed.",
        name: "Michael & Anne R.",
        role: "Retirement clients",
      },
    ],
  },
  cta: {
    eyebrow: "Ready when you are",
    title: "Invest with greater clarity.",
    body: "Let’s start with a conversation about the future you want to build.",
    button: "Schedule an introductory call",
  },
  contact: {
    eyebrow: "Get in touch",
    title: "Let’s start a\nconversation.",
    body: "Tell me a little about your goals and what you would like help with. I’ll respond personally to arrange a confidential, no-obligation introductory conversation.",
    email: "contact@danielcharlesevans.com",
  },
  footer: {
    tagline: "Independent investment advice,\naligned with your goals.",
    businessName: "Daniel Charles Evans Advisory",
    businessDetails: "Private investment advisory services\nBy appointment",
    legal:
      "© 2026 Daniel Charles Evans Advisory. Investment values can fall as well as rise. Past performance is not a reliable indicator of future results.",
  },
};

export const mergeContent = (
  value?: Partial<SiteContent> | null,
): SiteContent => ({
  ...defaultContent,
  ...value,
  hero: {
    ...defaultContent.hero,
    ...value?.hero,
    imageUrl:
      value?.hero?.imageUrl === "/hero-adviser.png"
        ? defaultContent.hero.imageUrl
        : value?.hero?.imageUrl || defaultContent.hero.imageUrl,
  },
  about: { ...defaultContent.about, ...value?.about },
  services: { ...defaultContent.services, ...value?.services },
  testimonials: { ...defaultContent.testimonials, ...value?.testimonials },
  cta: { ...defaultContent.cta, ...value?.cta },
  contact: { ...defaultContent.contact, ...value?.contact },
  footer: { ...defaultContent.footer, ...value?.footer },
  trust: value?.trust?.length ? value.trust : defaultContent.trust,
});
