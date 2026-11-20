
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Admin from './pages/Admin';

function App() {
  const location = useLocation();

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
