export type Platform = 'linkedin' | 'youtube' | 'instagram' | 'x' | 'newsletter' | 'threads'

export type SocialPost = {
  id: string
  platform: Platform
  title: string
  snippet: string
  url: string
  author: string
  publishedAt: string
  mediaType: 'article' | 'video' | 'short' | 'carousel' | 'thread'
  metrics: {
    views: string
    reactions: string
  }
  thumbnail?: string
}

export const platformMeta: Record<
  Platform,
  {
    label: string
    accent: string
    glow: string
    bg: string
  }
> = {
  linkedin: { label: 'LinkedIn', accent: '#0A66C2', glow: 'rgba(10,102,194,0.4)', bg: 'rgba(10,102,194,0.12)' },
  youtube: { label: 'YouTube', accent: '#FF0033', glow: 'rgba(255,0,51,0.4)', bg: 'rgba(255,0,51,0.12)' },
  instagram: { label: 'Instagram', accent: '#F77737', glow: 'rgba(247,119,55,0.4)', bg: 'rgba(247,119,55,0.12)' },
  x: { label: 'X', accent: '#FFFFFF', glow: 'rgba(255,255,255,0.25)', bg: 'rgba(255,255,255,0.08)' },
  newsletter: { label: 'Newsletter', accent: '#7C3AED', glow: 'rgba(124,58,237,0.4)', bg: 'rgba(124,58,237,0.12)' },
  threads: { label: 'Threads', accent: '#00D1B2', glow: 'rgba(0,209,178,0.4)', bg: 'rgba(0,209,178,0.12)' },
}

export const mockPosts: SocialPost[] = [
  {
    id: 'lnkd-01',
    platform: 'linkedin',
    title: 'Shipping a living resume',
    snippet: 'Documenting how a canvas-first portfolio outperforms static case studies.',
    url: 'https://linkedin.com/posts/averycodes',
    author: 'Avery Morgan',
    publishedAt: '2025-01-08T12:00:00Z',
    mediaType: 'article',
    metrics: { views: '42k', reactions: '1.1k' },
  },
  {
    id: 'yt-01',
    platform: 'youtube',
    title: 'From Figma to programmable stories',
    snippet: 'A 12-min walkthrough of the tooling behind Signal Canvas.',
    url: 'https://youtu.be/signal-canvas',
    author: 'Avery Morgan',
    publishedAt: '2024-12-20T16:00:00Z',
    mediaType: 'video',
    metrics: { views: '87k', reactions: '5.6k' },
  },
  {
    id: 'ig-01',
    platform: 'instagram',
    title: 'Reel: prototyping kinetic cards',
    snippet: 'Sketching floating tiles that respond to subtle cursor energy.',
    url: 'https://instagram.com/reel/kinetic-cards',
    author: 'Avery Morgan',
    publishedAt: '2025-01-02T10:00:00Z',
    mediaType: 'short',
    metrics: { views: '61k', reactions: '4.2k' },
  },
  {
    id: 'x-01',
    platform: 'x',
    title: 'Thread: your socials deserve spatial UI',
    snippet: 'Vertical feeds are for algorithms, not humans. Here’s how to remix them.',
    url: 'https://x.com/averycodes/status/1',
    author: 'Avery Morgan',
    publishedAt: '2024-12-28T08:00:00Z',
    mediaType: 'thread',
    metrics: { views: '320k', reactions: '8.3k' },
  },
  {
    id: 'news-01',
    platform: 'newsletter',
    title: 'Creative systems letter #21',
    snippet: 'Three plays for refactoring your personal brand into reusable parts.',
    url: 'https://newsletter.avery.codes/21',
    author: 'Avery Morgan',
    publishedAt: '2024-12-15T09:00:00Z',
    mediaType: 'article',
    metrics: { views: '18k', reactions: '2.1k' },
  },
  {
    id: 'yt-02',
    platform: 'youtube',
    title: 'Short: measuring narrative ROI',
    snippet: 'Micro-experiment proving why story-driven analytics resonate.',
    url: 'https://youtube.com/shorts/narrative-roi',
    author: 'Avery Morgan',
    publishedAt: '2025-01-10T14:00:00Z',
    mediaType: 'short',
    metrics: { views: '55k', reactions: '3.4k' },
  },
  {
    id: 'lnkd-02',
    platform: 'linkedin',
    title: 'Playbook: onboarding a new platform',
    snippet: 'Architecture decisions when plugging TikTok + Threads into Signal Canvas.',
    url: 'https://linkedin.com/posts/averycodes/signal-canvas',
    author: 'Avery Morgan',
    publishedAt: '2025-01-12T11:00:00Z',
    mediaType: 'article',
    metrics: { views: '36k', reactions: '900' },
  },
]
