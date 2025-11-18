import type { Platform, SocialPost } from '../data/socialPosts'
import { mockPosts, platformMeta } from '../data/socialPosts'

export type IntegrationStatus = {
  platform: Platform
  label: string
  connected: boolean
  account?: string
  lastSynced?: string
  description: string
}

const integrationSeed: IntegrationStatus[] = [
  { platform: 'linkedin', label: platformMeta.linkedin.label, connected: true, account: '@averycodes', lastSynced: '2m ago', description: 'Articles + long-form posts' },
  { platform: 'youtube', label: platformMeta.youtube.label, connected: true, account: '/@averycodes', lastSynced: '10m ago', description: 'Videos + shorts' },
  { platform: 'instagram', label: platformMeta.instagram.label, connected: false, description: 'Reels scheduled to sync' },
  { platform: 'x', label: platformMeta.x.label, connected: true, account: '@averycodes', lastSynced: '1h ago', description: 'Threads & quotable snippets' },
  { platform: 'newsletter', label: platformMeta.newsletter.label, connected: true, account: 'Creative Systems', lastSynced: '4h ago', description: 'Editorial archive' },
  { platform: 'threads', label: platformMeta.threads.label, connected: false, description: 'Launching next' },
]

export const fetchSocialPosts = async (): Promise<SocialPost[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return [...mockPosts]
}

export const getIntegrationSeed = () => integrationSeed.map((integration) => ({ ...integration }))

export const toggleIntegration = (platform: Platform, state: IntegrationStatus[]): IntegrationStatus[] => {
  return state.map((integration) =>
    integration.platform === platform
      ? {
          ...integration,
          connected: !integration.connected,
          lastSynced: !integration.connected ? 'Just now' : integration.lastSynced,
        }
      : integration,
  )
}

export const shufflePosts = <T>(items: T[]): T[] => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
