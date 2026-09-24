/**
 * The studio's ventures and projects.
 *
 * `layer` drives the card tint and must match a --layer-* token in global.css
 * (agents, retrieval, safety, controls, data, workflows), so a card's colour
 * names the kind of work it is.
 *
 * Add a venture here and it appears on the home page; nothing else to edit.
 */
export const ventures = [
  {
    slug: 'luminar',
    name: 'Luminar',
    type: 'Multi-agent research system',
    status: 'Open source',
    layer: 'agents',
    outcome: '45% better retrieval efficiency than the project baseline. Second prize among 250+ accelerator participants.',
    summary:
      'A deep-research system that coordinates specialised agents across web, video, academic, news and vector sources, with a consolidation step that checks for contradictions.',
    tags: ['Python', 'LangGraph', 'ChromaDB'],
    href: 'https://github.com/shab2112/Luminar',
    linkLabel: 'View the repository',
    external: true,
  },
  {
    slug: 'child-safety',
    name: 'Platform-level AI safety for children',
    type: 'Regulatory assurance concept',
    status: 'In development',
    layer: 'safety',
    outcome: 'Currently in competitive-gap analysis and customer validation.',
    summary:
      'Turns age-assurance and child-safety obligations into executable platform controls and verifiable evidence: which rule applied, which control ran, and whether it stayed effective.',
    tags: ['Assurance', 'Policy controls', 'Evidence'],
    href: '/portfolio#discovery',
    linkLabel: 'Read the concept',
  },
  {
    slug: 'real-estate',
    name: 'Real-estate intelligence platform',
    type: 'Conversational AI and operations',
    status: 'In production',
    layer: 'workflows',
    outcome: 'Built and deployed for two Dubai brokerages.',
    summary:
      'Connects conversational property discovery to leads, CRM, real-time reporting and financial workflows in one platform.',
    tags: ['Live audio', 'Tool calling', 'CRM'],
    href: '/portfolio#case-realestate',
    linkLabel: 'See the case',
  },
  {
    slug: 'trading',
    name: 'Trading and analytics systems',
    type: 'Applied machine learning',
    status: 'In production',
    layer: 'data',
    outcome: 'Prediction error below 1% after a correction algorithm I designed.',
    summary: 'Market-data pipelines and ML services for prediction, correction, forecasting and trade analytics.',
    tags: ['Python', 'TensorFlow', 'PostgreSQL'],
    href: '/portfolio#case-trading',
    linkLabel: 'See the case',
  },
  {
    slug: 'refusal-research',
    name: 'Refusal control in Llama 3 8B',
    type: 'Model safety research',
    status: 'Published',
    layer: 'safety',
    outcome: 'Accepted at NeurIPS 2025 and COLM 2026 interpretability workshops.',
    summary:
      'Mechanistic-interpretability research into category-specific refusal directions and steering them at inference time.',
    tags: ['LLM safety', 'Activation steering'],
    href: '/portfolio#research',
    linkLabel: 'Read the papers',
  },
  {
    slug: 'cerico',
    name: 'CERICO',
    type: 'Enterprise risk platform',
    status: 'Acquired',
    layer: 'controls',
    outcome: 'Acquired by Dow Jones in March 2018.',
    summary:
      'A cloud platform for auditable third-party risk assessment. I led the functional architecture across scoring, workflow states, approvals and reporting.',
    tags: ['Functional architecture', 'Risk models'],
    href: 'https://www.dowjones.com/press-room/dow-jones-acquires-cerico/',
    linkLabel: 'Dow Jones announcement',
    external: true,
  },
];
