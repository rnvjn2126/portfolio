import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CursorBrushTrail from './components/CursorBrushTrail'
import { EmailContactProvider } from './components/EmailContact'
import { ScrollProgress } from './components/MotionPrimitives'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import Privacy from './pages/Privacy'

function App() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const pageInitial = reduceMotion ? false : { opacity: 0, y: 12 }
  const pageTransition = { duration: reduceMotion ? 0 : .4 }

  useEffect(() => { if (!location.hash) window.scrollTo(0, 0) }, [location.pathname])
  useEffect(() => {
    if (!location.hash) return
    let targetId
    try {
      targetId = decodeURIComponent(location.hash.slice(1))
    } catch {
      return // Invalid fragments should not crash page navigation.
    }
    const frameId = window.requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    }))
    return () => window.cancelAnimationFrame(frameId)
  }, [location.pathname, location.hash, reduceMotion])

  return <EmailContactProvider>
    {!location.pathname.startsWith('/admin') && <CursorBrushTrail />}
    <ScrollProgress />
    <Navbar />
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<motion.div initial={pageInitial} animate={{ opacity: 1, y: 0 }} transition={pageTransition}><Home /></motion.div>} />
      <Route path="/projects" element={<motion.div initial={pageInitial} animate={{ opacity: 1, y: 0 }} transition={pageTransition}><Projects /></motion.div>} />
      <Route path="/projects/:slug" element={<ProjectDetails />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/admin/*" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Home />} />
    </Routes>
    {!location.pathname.startsWith('/admin') && <Footer />}
  </EmailContactProvider>
}
export default App
