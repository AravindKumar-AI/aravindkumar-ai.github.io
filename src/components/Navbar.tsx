import { NavLink } from 'react-router-dom'
import { FiMail } from 'react-icons/fi'
import { heroProfile } from '../data/profile'

type NavbarProps = {
  highlightCanvas?: boolean
}

const links = [
  { label: 'Portfolio', to: '/' },
  { label: 'Signal Canvas', to: '/signal-canvas' },
]

const Navbar = ({ highlightCanvas = false }: NavbarProps) => {
  return (
    <header className={`site-nav ${highlightCanvas ? 'site-nav--glass' : ''}`}>
      <div className="site-nav__brand">
        <span className="site-nav__monogram">{heroProfile.monogram}</span>
        <div className="site-nav__caption">
          <strong>{heroProfile.name}</strong>
          <span>{heroProfile.role}</span>
        </div>
      </div>
      <nav className="site-nav__links">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <a className="site-nav__cta" href={`mailto:${heroProfile.contact.email}`}>
        <FiMail />
        <span>Book a call</span>
      </a>
    </header>
  )
}

export default Navbar
