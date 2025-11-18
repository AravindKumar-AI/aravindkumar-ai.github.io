import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import PortfolioPage from './pages/PortfolioPage'
import SocialCanvasPage from './pages/SocialCanvasPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/signal-canvas" element={<SocialCanvasPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
