export type Metric = {
  label: string
  value: string
  context: string
}

export type ExperienceEntry = {
  role: string
  company: string
  period: string
  summary: string
  bullets: string[]
  stack: string[]
}

export type EducationEntry = {
  school: string
  degree: string
  period: string
  focus: string
  highlights: string[]
}

export type ProjectSpotlight = {
  name: string
  description: string
  impact: string
  link: string
  tags: string[]
}

export type Capability = {
  title: string
  description: string
  bullets: string[]
}

export type SocialPlatform = 'linkedin' | 'github' | 'youtube' | 'instagram' | 'x'

export type SocialLink = {
  platform: SocialPlatform
  label: string
  url: string
}

export type HeroProfile = {
  name: string
  monogram: string
  role: string
  summary: string
  location: string
  tagline: string
  availability: string
  contact: {
    email: string
    availability: string
  }
  social: SocialLink[]
  focus: string[]
}

export const heroProfile: HeroProfile = {
  name: 'Avery Morgan',
  monogram: 'AM',
  role: 'Creative Technologist & Product Storyteller',
  summary:
    'I build immersive portfolio systems, experiment with canvas-first interfaces, and translate complex journeys into friendly digital narratives.',
  location: 'Brooklyn, NY',
  tagline: 'Former design systems lead crafting expressive, data-connected personal brands.',
  availability: 'Accepting advisory & fractional head-of-product roles',
  contact: {
    email: 'hello@avery.codes',
    availability: 'Consulting kicks off January 2026 — reserve time now',
  },
  social: [
    { platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/averycodes' },
    { platform: 'github', label: 'GitHub', url: 'https://github.com/averycodes' },
    { platform: 'youtube', label: 'YouTube', url: 'https://youtube.com/@averycodes' },
    { platform: 'instagram', label: 'Instagram', url: 'https://instagram.com/avery.codes' },
    { platform: 'x', label: 'X (Twitter)', url: 'https://x.com/averycodes' },
  ],
  focus: ['Personal brand OS', 'Multi-platform storytelling', 'Measurable creative systems'],
}

export const metrics: Metric[] = [
  { label: 'Products shipped', value: '24', context: 'Across consumer, creator, and enterprise stacks' },
  { label: 'Audience reach', value: '3.1M', context: 'Aggregate followers & subscribers' },
  { label: 'Time-to-launch', value: '11 weeks', context: 'From concept to production canvas' },
  { label: 'Activation lift', value: '+48%', context: 'Average engagement after redesign' },
]

export const experience: ExperienceEntry[] = [
  {
    role: 'Head of Brand Engineering',
    company: 'PulseWave Studio',
    period: '2022 — Present',
    summary: 'Leading a hybrid team shipping interactive credential sites for founders & creators.',
    bullets: [
      'Scaled a reusable storytelling system powering 40+ bespoke portfolio canvases.',
      'Built a social data ingestion pipeline that normalizes posts from 8 platforms.',
      'Mentored cross-disciplinary squads on creative prototyping and measurement.',
    ],
    stack: ['React', 'Canvas API', 'Next.js', 'Motion design', 'LLM tooling'],
  },
  {
    role: 'Design Systems Engineer',
    company: 'Nova Labs',
    period: '2019 — 2022',
    summary: 'Owned the experience layer for Nova’s web and mobile collaborators platform.',
    bullets: [
      'Codified an adaptive theming language adopted across 6 products.',
      'Delivered an internal portfolio builder used by 4,000+ employees.',
      'Collaborated with marketing to translate research into interactive stories.',
    ],
    stack: ['TypeScript', 'GraphQL', 'Storybook', 'Accessibility'],
  },
]

export const education: EducationEntry[] = [
  {
    school: 'Parsons School of Design',
    degree: 'MFA, Design & Technology',
    period: '2017 — 2019',
    focus: 'Creative coding, speculative design, computational storytelling',
    highlights: ['Graduate thesis on “living resumes”', 'Faculty fellow for immersive media lab'],
  },
  {
    school: 'University of Washington',
    degree: 'B.S., Human Centered Design & Engineering',
    period: '2012 — 2016',
    focus: 'Interactive systems, cognitive UX, entrepreneurship',
    highlights: ['Magna Cum Laude', 'Women in Tech Scholar'],
  },
]

export const capabilities: Capability[] = [
  {
    title: 'Narrative engineering',
    description: 'Translate career arcs into actionable, scannable systems.',
    bullets: ['Structured storytelling', 'Long-form writing', 'Founder positioning'],
  },
  {
    title: 'Creative prototyping',
    description: 'Blend WebGL, canvas, and data viz for responsive artifacts.',
    bullets: ['Rapid prototyping', 'Canvas tooling', 'Interaction design'],
  },
  {
    title: 'Content automation',
    description: 'Connect APIs from every platform into resilient content meshes.',
    bullets: ['Social ingestion', 'Scheduler automation', 'Analytics dashboards'],
  },
]

export const projects: ProjectSpotlight[] = [
  {
    name: 'Studio Atlas',
    description: 'An interactive knowledge garden for solo consultants.',
    impact: 'Cut onboarding time by 60% while tripling demo conversions.',
    link: 'https://atlas.avery.codes',
    tags: ['Systems thinking', 'API orchestration', 'Design ops'],
  },
  {
    name: 'Signal Canvas',
    description: 'Unified surface for live social posts rendered as physics objects.',
    impact: 'Improved cross-platform engagement attribution with playful UI.',
    link: 'https://signal.avery.codes',
    tags: ['Canvas API', 'Content strategy', 'Data viz'],
  },
  {
    name: 'StoryOS',
    description: 'Component library that ships personal brands in under 3 weeks.',
    impact: 'Used by 15 agencies to streamline premium portfolio builds.',
    link: 'https://storyos.avery.codes',
    tags: ['Design systems', 'Automation', 'Research'],
  },
]
