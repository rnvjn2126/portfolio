
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'motion/react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Admin from './pages/Admin';

function App() {
  const location = useLocation();

  // Scroll to the top whenever the page changes.
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // Scroll to a specific section when a URL hash exists.
  useEffect(() => {
    if (!location.hash) return;

    const targetId = decodeURIComponent(location.hash.slice(1));

    const frameId = window.requestAnimationFrame(() => {
      document
        .getElementById(targetId)
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [location.pathname, location.hash]);

  return (
    <>
      <Navbar />

      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Home />
            </motion.div>
          }
        />

        <Route
          path="/projects"
          element={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Projects />
            </motion.div>
          }
        />

        <Route
          path="/projects/:slug"
          element={<ProjectDetails />}
        />

        <Route
          path="/admin/*"
          element={<Admin />}
        />

        <Route path="*" element={<Home />} />
      </Routes>

      {!location.pathname.startsWith('/admin') && <Footer />}
    </>
  );
}

export default App;
