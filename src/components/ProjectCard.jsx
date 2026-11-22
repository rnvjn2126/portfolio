import { ArrowRight, ArrowUpRight, FileText, Github, Globe, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { EmailTrigger } from './EmailContact'

export default function ProjectCard({ project, index = 0, showActions = false }) {
  const reduce = useReducedMotion()

  return (
    <motion.article
      className={'project-card' + (showActions ? ' project-card--listing' : '')}
      initial={{ opacity: 0, y: reduce ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduce ? undefined : { y: -3 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduce ? 0.01 : 0.45, delay: reduce ? 0 : (index % 2) * 0.07 }}
    >
      <Link to={'/projects/' + project.slug} className="project-image-wrap" aria-label={'Read about ' + project.title}>
        <motion.img
          src={project.cover}
          onError={event => { const image = event.currentTarget; if (project.fallbackCover && !image.dataset.fallbackApplied) { image.dataset.fallbackApplied = 'true'; image.src = project.fallbackCover } }}
          alt={project.coverAlt || project.title + ' project preview'}
          className="project-image"
          loading="lazy"
          decoding="async"
          whileHover={reduce ? undefined : { scale: 1.025 }}
          transition={{ duration: 0.5 }}
        />
        <span className="project-image-number">{project.number} / SELECTED WORK</span>
        <span className="image-arrow" aria-hidden="true"><ArrowUpRight size={19} /></span>
      </Link>
      <div className="project-card-body">
        <div className="project-meta"><span>{project.category}</span><span>{project.year}</span></div>
        <Link to={'/projects/' + project.slug} className="project-title-link">
          <h3>{project.title}<ArrowUpRight size={19} aria-hidden="true" /></h3>
        </Link>
        <p>{project.description}</p>
        {project.customizable && (
          <div className="project-custom-note">
            <Sparkles size={15} aria-hidden="true" />
            <strong>ERP built to your specifications</strong>
          </div>
        )}
        <div className="tag-row">
          {project.tags.slice(0, 4).map(tag => <span className="tag" key={tag}>{tag}</span>)}
        </div>
        {project.developmentNote && <span className="project-development-note">{project.developmentNote}</span>}
        {project.paper && (
          <Link
            className="project-research-link"
            to={'/projects/' + project.slug}
            aria-label={'Read research related to ' + project.title}
          >
            <FileText size={17} aria-hidden="true" />
            <span>Related research paper</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        )}
        {showActions ? (
          <div className="project-actions">
            {project.liveUrl ? (
              <a className="project-live-button project-primary-action" href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={'Open live demo of ' + project.title + ' in a new tab'}>
                <Globe size={17} aria-hidden="true" /> <span>View live project</span> <ArrowUpRight className="project-live-arrow" size={16} aria-hidden="true" />
              </a>
            ) : project.customizable ? (
              <EmailTrigger className="project-live-button project-primary-action" aria-label={'Ask about a customized ' + project.title}>
                <Sparkles size={17} aria-hidden="true" /> <span>Discuss your ERP</span> <ArrowUpRight className="project-live-arrow" size={16} aria-hidden="true" />
              </EmailTrigger>
            ) : (
              <Link className="project-live-button project-primary-action" to={'/projects/' + project.slug}>
                <ArrowUpRight size={17} aria-hidden="true" /> <span>Explore project</span>
              </Link>
            )}
            {project.githubUrl && (
              <a className="project-source-button" href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={'View ' + project.title + ' source code'}>
                <Github size={17} aria-hidden="true" /> <span>Source</span>
              </a>
            )}
            <Link className="project-details-button" to={'/projects/' + project.slug} aria-label={'Read the ' + project.title + ' case study'}>
              <span>Details</span> <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <Link className="project-case-link" to={'/projects/' + project.slug}>
            View project details <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>
    </motion.article>
  )
}
