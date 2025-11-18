import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCheckCircle, FiCloud, FiRefreshCw, FiToggleLeft, FiToggleRight } from 'react-icons/fi'
import FloatingCanvas from '../components/FloatingCanvas'
import type { SocialPost } from '../data/socialPosts'
import { platformMeta } from '../data/socialPosts'
import type { IntegrationStatus } from '../services/socialBridge'
import { fetchSocialPosts, getIntegrationSeed, shufflePosts, toggleIntegration } from '../services/socialBridge'

const SocialCanvasPage = () => {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>(() => getIntegrationSeed())

  useEffect(() => {
    refreshPosts()
  }, [])

  const refreshPosts = async () => {
    setLoading(true)
    const fresh = await fetchSocialPosts()
    setPosts(shufflePosts(fresh))
    setLoading(false)
  }

  const handleToggle = (platform: IntegrationStatus['platform']) => {
    setIntegrations((prev) => toggleIntegration(platform, prev))
  }

  return (
    <div className="canvas-page">
      <section className="canvas-hero">
        <div>
          <p className="eyebrow">Signal Canvas</p>
          <h1>A spatial reader for every social proof</h1>
          <p>
            Connect your social graph once. Every post, video, reel, and long-form essay blooms here as a floating narrative.
            The canvas randomizes layouts to keep the experience playful every visit.
          </p>
          <div className="canvas-hero__actions">
            <button type="button" className="btn btn--primary" onClick={refreshPosts}>
              <FiRefreshCw />
              Shuffle posts
            </button>
            <Link className="btn btn--secondary" to="/">
              Back to portfolio
              <FiCloud />
            </Link>
          </div>
          <p className="canvas-hero__note">
            When an integration flips on, its posts join the physics pool instantly. More platforms slot in without changing the UI.
          </p>
        </div>
      </section>

      <section className="canvas-stage">
        {loading ? (
          <div className="canvas-stage__loading">
            <span className="spinner" />
            <p>Syncing the latest stories…</p>
          </div>
        ) : (
          <FloatingCanvas posts={posts} />
        )}
      </section>

      <section className="integrations">
        <header>
          <div>
            <p className="eyebrow">Integrations</p>
            <h2>Toggle your social firehose</h2>
          </div>
          <p>Click any platform to simulate a connect/disconnect state.</p>
        </header>
        <div className="integrations__grid">
          {integrations.map((integration) => (
            <article
              key={integration.platform}
              className={`integration-card ${integration.connected ? 'is-connected' : ''}`}
              style={{ borderColor: platformMeta[integration.platform].accent }}
            >
              <div className="integration-card__header">
                <div>
                  <p className="integration-card__label">{integration.label}</p>
                  <p className="integration-card__account">{integration.account ?? 'Not linked yet'}</p>
                </div>
                <button type="button" onClick={() => handleToggle(integration.platform)}>
                  {integration.connected ? <FiToggleRight /> : <FiToggleLeft />}
                </button>
              </div>
              <p className="integration-card__description">{integration.description}</p>
              <footer>
                {integration.connected ? (
                  <>
                    <FiCheckCircle />
                    <span>Live • {integration.lastSynced}</span>
                  </>
                ) : (
                  <span>Click to connect</span>
                )}
              </footer>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default SocialCanvasPage
