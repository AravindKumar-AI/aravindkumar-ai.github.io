import { Link } from 'react-router-dom'
import { FiArrowRight, FiExternalLink, FiMapPin, FiPlay } from 'react-icons/fi'
import { capabilities, education, experience, heroProfile, metrics, projects } from '../data/profile'

const PortfolioPage = () => {
  return (
    <div className="portfolio-page">
      <section className="hero-panel">
        <div className="hero-panel__content">
          <p className="eyebrow">Portfolio OS</p>
          <h1>{heroProfile.name}</h1>
          <p className="hero-panel__role">{heroProfile.role}</p>
          <p className="hero-panel__summary">{heroProfile.summary}</p>
          <div className="hero-panel__meta">
            <span>
              <FiMapPin />
              {heroProfile.location}
            </span>
            <span>{heroProfile.tagline}</span>
          </div>
          <div className="hero-panel__actions">
            <a className="btn btn--primary" href={`mailto:${heroProfile.contact.email}`}>
              Introduce yourself
              <FiArrowRight />
            </a>
            <Link className="btn btn--secondary" to="/signal-canvas">
              Explore Signal Canvas
              <FiPlay />
            </Link>
          </div>
        </div>
        <ul className="hero-panel__focus">
          {heroProfile.focus.map((theme) => (
            <li key={theme}>{theme}</li>
          ))}
        </ul>
      </section>

      <section className="metrics-grid">
        {metrics.map((metric) => (
          <article key={metric.label}>
            <p className="metric__value">{metric.value}</p>
            <p className="metric__label">{metric.label}</p>
            <p className="metric__context">{metric.context}</p>
          </article>
        ))}
      </section>

      <section className="section-card">
        <header className="section-card__header">
          <div>
            <p className="eyebrow">Experience</p>
            <h2>Research-backed, story-driven builds</h2>
          </div>
          <a href="https://drive.google.com" target="_blank" rel="noreferrer">
            Download full resume <FiExternalLink />
          </a>
        </header>
        <div className="timeline">
          {experience.map((item) => (
            <article key={item.company} className="timeline__card">
              <header>
                <div>
                  <p className="timeline__role">{item.role}</p>
                  <p className="timeline__company">{item.company}</p>
                </div>
                <span className="timeline__period">{item.period}</span>
              </header>
              <p className="timeline__summary">{item.summary}</p>
              <ul className="timeline__list">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="timeline__stack">
                {item.stack.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card section-card--alt">
        <header className="section-card__header">
          <div>
            <p className="eyebrow">Education</p>
            <h2>Creative rigor meets systems thinking</h2>
          </div>
        </header>
        <div className="education">
          {education.map((item) => (
            <article key={item.school}>
              <p className="education__degree">{item.degree}</p>
              <h3>{item.school}</h3>
              <p className="education__period">{item.period}</p>
              <p className="education__focus">{item.focus}</p>
              <ul>
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <header className="section-card__header">
          <div>
            <p className="eyebrow">Projects</p>
            <h2>Flagship stories shipped recently</h2>
          </div>
        </header>
        <div className="projects-grid">
          {projects.map((project) => (
            <article key={project.name} className="project-card">
              <header>
                <h3>{project.name}</h3>
                <a href={project.link} target="_blank" rel="noreferrer">
                  Visit <FiExternalLink />
                </a>
              </header>
              <p className="project-card__description">{project.description}</p>
              <p className="project-card__impact">{project.impact}</p>
              <div className="project-card__tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card section-card--alt">
        <header className="section-card__header">
          <div>
            <p className="eyebrow">Capabilities</p>
            <h2>What collaboration feels like</h2>
          </div>
        </header>
        <div className="capabilities-grid">
          {capabilities.map((capability) => (
            <article key={capability.title}>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
              <ul>
                {capability.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-card">
        <div>
          <p className="eyebrow">Next up</p>
          <h2>Bring your socials into a spatial canvas</h2>
          <p>Connect LinkedIn, YouTube, Instagram, X, Threads, and anything that comes next.</p>
        </div>
        <Link className="btn btn--primary" to="/signal-canvas">
          Launch the social canvas
          <FiArrowRight />
        </Link>
      </section>
    </div>
  )
}

export default PortfolioPage
