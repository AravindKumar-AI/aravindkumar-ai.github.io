import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = () => {
  const { pathname } = useLocation()
  const isCanvasPage = pathname === '/signal-canvas'

  return (
    <div className={`app-shell ${isCanvasPage ? 'app-shell--dark' : ''}`}>
      <Navbar highlightCanvas={isCanvasPage} />
      <div className="content-shell">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Layout
