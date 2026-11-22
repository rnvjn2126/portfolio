import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Reveal from '../components/Reveal'
import ProjectCard from '../components/ProjectCard'
import { SpotlightCard, TiltCard } from '../components/MotionPrimitives'
import { projects } from '../data/projects'

export default function Projects() {
  const categories = ['All', ...new Set(projects.map(p => p.category))]
  const [active, setActive] = useState('All')
  const filtered = useMemo(() => active === 'All' ? projects : projects.filter(p => p.category === active), [active])

  return (
    <section className="page-section shell">
      <Reveal>
        <div className="section-kicker"><span>THE ARCHIVE</span><span className="line" /></div>
        <h1 className="page-heading">Selected <span className="gradient-text">work.</span></h1>
        <p className="page-lede">A closer look at the projects, ideas and details I've brought together.</p>
      </Reveal>
      <div className="filter-row">
        {categories.map(category => <button key={category} className={`filter-chip ${active === category ? 'active' : ''}`} onClick={() => setActive(category)}>
          {active === category && <motion.span className="filter-chip-indicator" layoutId="active-filter" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <span className="filter-chip-label">{category}</span>
        </button>)}
      </div>
      <motion.div layout className="project-grid">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => <motion.div key={project.slug} layout initial={{ opacity: 0, y: 24, scale: .97, filter: 'blur(7px)' }} animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -12, scale: .97, filter: 'blur(5px)' }} transition={{ duration: .42, delay: i * .045, ease: [.22, 1, .36, 1] }}>
            <SpotlightCard className="project-spotlight"><TiltCard className="project-tilt"><ProjectCard project={project} index={i} /></TiltCard></SpotlightCard>
          </motion.div>)}
        </AnimatePresence>
      </motion.div>
      {filtered.length === 0 && <p className="body-copy">No projects in this category yet.</p>}
    </section>
  )
}
