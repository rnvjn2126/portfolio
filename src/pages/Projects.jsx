import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'

const mainProjects = projects.filter(project => project.status !== 'work-in-progress')
const projectsInProgress = projects.filter(project => project.status === 'work-in-progress')

export default function Projects() {
  const categories = ['All', ...new Set(mainProjects.map(project => project.category)), 'Work in progress']
  const [active, setActive] = useState('All')

  const filtered = useMemo(() => {
    if (active === 'Work in progress') return []
    return active === 'All'
      ? mainProjects
      : mainProjects.filter(project => project.category === active)
  }, [active])
  const showInProgress = active === 'All' || active === 'Work in progress'
  const visibleCount = filtered.length + (showInProgress ? projectsInProgress.length : 0)

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
            <p>Web experiences, career tools and customizable business software. Explore finished case studies and what's coming next.</p>
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
        <span className="projects-count">{String(visibleCount).padStart(2, '0')} PROJECT{visibleCount === 1 ? '' : 'S'}</span>
      </div>

      {filtered.length > 0 && (
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
      )}

      {showInProgress && projectsInProgress.length > 0 && (
        <section className="projects-wip" id="work-in-progress" aria-labelledby="projects-wip-title">
          <div className="projects-wip-heading">
            <div>
              <span className="eyebrow"><Clock3 size={14} aria-hidden="true" /> DEVELOPMENT JOURNAL / CURRENTLY BUILDING</span>
              <h2 id="projects-wip-title">Work in <span className="gradient-text">progress.</span></h2>
            </div>
            <p>A look at what I'm building and testing next. These are working prototypes, not publicly hosted products.</p>
          </div>
          <div className="projects-wip-list">
            {projectsInProgress.map(project => (
              <Link className="projects-wip-card" to={'/projects/' + project.slug} key={project.slug}>
                <div className="projects-wip-preview">
                  <img
                    src={project.cover}
                    alt={project.coverAlt}
                    loading="lazy"
                    decoding="async"
                    onError={event => {
                      const image = event.currentTarget
                      if (project.fallbackCover && !image.dataset.fallbackApplied) {
                        image.dataset.fallbackApplied = 'true'
                        image.src = project.fallbackCover
                      }
                    }}
                  />
                </div>
                <div className="projects-wip-info">
                  <span className="projects-wip-status"><Clock3 size={13} aria-hidden="true" /> IN DEVELOPMENT / {project.year}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <span className="projects-wip-tags">{project.tags.slice(0, 4).join('  ·  ')}</span>
                  <span className="projects-wip-link">Explore progress <ArrowUpRight size={16} aria-hidden="true" /></span>
                </div>
                <ArrowUpRight size={21} className="projects-wip-corner" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      )}
      {visibleCount === 0 && <p className="body-copy">No projects in this category yet.</p>}
      <p className="projects-note">Previews are genuine application screenshots when available, with an illustrated fallback. Public projects have live demo links; the private ERP is represented by fictional demo data, and active prototypes are shown separately.</p>
    </section>
  )
}
