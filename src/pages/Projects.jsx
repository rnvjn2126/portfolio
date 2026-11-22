import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import Reveal from '../components/Reveal'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'

export default function Projects() {
  const categories = ['All', ...new Set(projects.map(project => project.category))]
  const [active, setActive] = useState('All')
  const filtered = useMemo(
    () => active === 'All' ? projects : projects.filter(project => project.category === active),
    [active],
  )

  return (
    <section className="page-section shell projects-page">
      <Reveal>
        <div className="section-kicker"><span>01 / PORTFOLIO</span><span className="line" /></div>
        <div className="projects-intro">
          <div>
            <span className="eyebrow projects-eyebrow">A CURATED SELECTION OF RECENT WORK</span>
            <h1 className="page-heading">Selected <span className="gradient-text">projects.</span></h1>
          </div>
          <div className="projects-intro-aside">
            <p>From responsive websites to AI applications and ERP software, explore what I've designed and built.</p>
            <span>Explore the work below <ArrowUpRight size={15} aria-hidden="true" /></span>
          </div>
        </div>
      </Reveal>

      <div className="projects-toolbar">
        <div className="filter-row" role="group" aria-label="Filter projects">
          {categories.map(category => (
            <button
              key={category}
              className={'filter-chip' + (active === category ? ' active' : '')}
              onClick={() => setActive(category)}
              type="button"
              aria-pressed={active === category}
            >
              {category}
            </button>
          ))}
        </div>
        <span className="projects-count">{String(filtered.length).padStart(2, '0')} PROJECT{filtered.length === 1 ? '' : 'S'}</span>
      </div>

      <motion.div layout className="project-grid project-grid--listing">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, index) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, delay: index * 0.035 }}
            >
              <ProjectCard project={project} index={index} showActions />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {filtered.length === 0 && <p className="body-copy">No projects in this category yet.</p>}
      <p className="projects-note">Previews are captured from live websites or running local demos when available. A design illustration appears if a screenshot is unavailable. Public applications have a “View live project” link, while the private ERP demo is presented through real screenshots.</p>
    </section>
  )
}
