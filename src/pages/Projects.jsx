import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import Reveal from '../components/Reveal'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'

export default function Projects() {
  const categories = ['All', ...new Set(projects.map(p => p.category))]
  const [active, setActive] = useState('All')

  const filtered = useMemo(
    () =>
      active === 'All'
        ? projects
        : projects.filter(p => p.category === active),
    [active]
  )

  return (
    <section className="page-section shell">
      <Reveal>
        <div className="section-kicker">
          <span>THE ARCHIVE</span>
          <span className="line" />
        </div>

        <h1 className="page-heading">
          Selected <span className="gradient-text">work.</span>
        </h1>

        <p className="page-lede">
          A closer look at the projects, ideas and details I've brought together.
        </p>
      </Reveal>

      <div className="filter-row">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-chip ${active === category ? 'active' : ''}`}
            onClick={() => setActive(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <motion.div layout className="project-grid">
        {filtered.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={i}
          />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="body-copy">No projects in this category yet.</p>
      )}
    </section>
  )
}