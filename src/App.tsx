import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Team } from './pages/Team'
import { Assets } from './pages/Assets'
import { Analytics } from './pages/Analytics'
import { Projects } from './pages/Projects'
import { Settings } from './pages/Settings'

// Component to track route changes
function RouteTracker() {
  const location = useLocation()
  
  useEffect(() => {
    console.log(`Navigation: Route changed to ${location.pathname}`)
  }, [location])
  
  return null
}

function App() {
  useEffect(() => {
    console.log('🚀 DAT 4ME App initialized')
    console.log('Current URL:', window.location.href)
    console.log('User Agent:', navigator.userAgent)
  }, [])
  
  return (
    <Router>
      <RouteTracker />
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/team" element={<Team />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
