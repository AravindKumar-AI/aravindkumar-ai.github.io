import { FiGithub, FiInstagram, FiLinkedin, FiTwitter, FiYoutube } from 'react-icons/fi'
import { heroProfile } from '../data/profile'

const iconMap = {
  linkedin: <FiLinkedin />,
  github: <FiGithub />,
  youtube: <FiYoutube />,
  instagram: <FiInstagram />,
  x: <FiTwitter />,
}

const Footer = () => {
  return (
    <footer className="site-footer">
      <div>
        <p className="site-footer__eyebrow">Next availability</p>
        <strong>{heroProfile.contact.availability}</strong>
      </div>
      <div className="site-footer__social">
        {heroProfile.social.map((item) => (
          <a key={item.platform} href={item.url} target="_blank" rel="noreferrer">
            {iconMap[item.platform]}
            <span>{item.label}</span>
          </a>
        ))}
      </div>
      <p className="site-footer__note">© {new Date().getFullYear()} {heroProfile.name}. Crafted in public.</p>
    </footer>
  )
}

export default Footer
