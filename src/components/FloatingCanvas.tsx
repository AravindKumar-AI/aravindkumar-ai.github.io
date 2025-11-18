import { useEffect, useRef, useState } from 'react'
import type { SocialPost } from '../data/socialPosts'
import { platformMeta } from '../data/socialPosts'

type FloatingCanvasProps = {
  posts: SocialPost[]
}

type Particle = {
  id: string
  post: SocialPost
  x: number
  y: number
  width: number
  height: number
  vx: number
  vy: number
}

type HoverState = {
  x: number
  y: number
  post: SocialPost
} | null

const BASE_WIDTH = 240
const BASE_HEIGHT = 140

const FloatingCanvas = ({ posts }: FloatingCanvasProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | null>(null)
  const [hovered, setHovered] = useState<HoverState>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || posts.length === 0) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    const handleResize = () => {
      const { width, height } = container.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
      initializeParticles(width, height)
    }

    const initializeParticles = (width: number, height: number) => {
      particlesRef.current = posts.map((post) => {
        const scale = 0.75 + Math.random() * 0.6
        const cardWidth = BASE_WIDTH * scale
        const cardHeight = BASE_HEIGHT * scale
        return {
          id: post.id,
          post,
          width: cardWidth,
          height: cardHeight,
          x: Math.random() * (width - cardWidth),
          y: Math.random() * (height - cardHeight),
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
        }
      })
    }

    const draw = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)
      particlesRef.current.forEach((particle) => {
        updateParticlePosition(particle, width, height)
        drawCard(ctx, particle)
      })
      animationRef.current = requestAnimationFrame(draw)
    }

    const updateParticlePosition = (particle: Particle, width: number, height: number) => {
      particle.x += particle.vx
      particle.y += particle.vy

      if (particle.x <= 0 || particle.x + particle.width >= width) {
        particle.vx *= -1
      }
      if (particle.y <= 0 || particle.y + particle.height >= height) {
        particle.vy *= -1
      }
    }

    const drawCard = (ctx: CanvasRenderingContext2D, particle: Particle) => {
      const meta = platformMeta[particle.post.platform]
      const { x, y, width, height } = particle

      ctx.save()
      ctx.shadowColor = meta.glow
      ctx.shadowBlur = 25
      drawRoundedRect(ctx, x, y, width, height, 18, meta.bg)
      ctx.shadowBlur = 0
      ctx.strokeStyle = meta.accent
      ctx.lineWidth = 1
      drawRoundedRectOutline(ctx, x, y, width, height, 18)

      ctx.fillStyle = '#ffffff'
      ctx.font = '600 16px "Space Grotesk", sans-serif'
      ctx.fillText(meta.label, x + 18, y + 32)

      ctx.font = '500 15px "Space Grotesk", sans-serif'
      ctx.fillText(particle.post.title, x + 18, y + 58)

      ctx.font = '400 13px "Space Grotesk", sans-serif'
      wrapText(ctx, particle.post.snippet, x + 18, y + 82, width - 36, 18, 3)

      ctx.fillStyle = 'rgba(255,255,255,0.75)'
      ctx.font = '400 12px "Space Grotesk", sans-serif'
      ctx.fillText(`👁‍🗨 ${particle.post.metrics.views} • ❤️ ${particle.post.metrics.reactions}`, x + 18, y + height - 18)

      ctx.restore()
    }

    const handlePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const hit = particlesRef.current.find(
        (particle) => x >= particle.x && x <= particle.x + particle.width && y >= particle.y && y <= particle.y + particle.height,
      )

      if (hit) {
        setHovered({
          x,
          y,
          post: hit.post,
        })
      } else {
        setHovered(null)
      }
    }

    const handleLeave = () => setHovered(null)

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const hit = particlesRef.current.find(
        (particle) => x >= particle.x && x <= particle.x + particle.width && y >= particle.y && y <= particle.y + particle.height,
      )

      if (hit) {
        window.open(hit.post.url, '_blank', 'noopener,noreferrer')
      }
    }

    handleResize()
    draw()
    canvas.addEventListener('pointermove', handlePointer)
    canvas.addEventListener('pointerleave', handleLeave)
    canvas.addEventListener('click', handleClick)
    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      canvas.removeEventListener('pointermove', handlePointer)
      canvas.removeEventListener('pointerleave', handleLeave)
      canvas.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
    }
  }, [posts])

  return (
    <div className="floating-canvas" ref={containerRef}>
      <canvas ref={canvasRef} />
      {hovered && (
        <div className="floating-canvas__tooltip" style={{ transform: `translate(${hovered.x + 20}px, ${hovered.y}px)` }}>
          <p className="tooltip__eyebrow">{platformMeta[hovered.post.platform].label}</p>
          <p className="tooltip__title">{hovered.post.title}</p>
          <p className="tooltip__snippet">{hovered.post.snippet}</p>
          <p className="tooltip__meta">
            {hovered.post.mediaType} • {new Date(hovered.post.publishedAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  )
}

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string,
) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
  ctx.fillStyle = fillStyle
  ctx.fill()
}

const drawRoundedRectOutline = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
  ctx.stroke()
}

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) => {
  const words = text.split(' ')
  let line = ''
  let lineCount = 0

  for (let n = 0; n < words.length; n += 1) {
    const testLine = `${line}${words[n]} `
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, y)
      line = `${words[n]} `
      y += lineHeight
      lineCount += 1
      if (lineCount === maxLines - 1) {
        break
      }
    } else {
      line = testLine
    }
  }
  const remainder = line.trim()
  if (remainder) {
    if (lineCount === maxLines - 1 && ctx.measureText(remainder).width > maxWidth) {
      let truncated = remainder
      while (ctx.measureText(`${truncated}…`).width > maxWidth && truncated.length > 0) {
        truncated = truncated.slice(0, -1)
      }
      ctx.fillText(`${truncated}…`, x, y)
    } else {
      ctx.fillText(remainder, x, y)
    }
  }
}

export default FloatingCanvas
