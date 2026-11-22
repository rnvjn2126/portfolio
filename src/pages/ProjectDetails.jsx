import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Download, FileText } from 'lucide-react'
import { projects } from '../data/projects'
import Button from '../components/Button'

export default function ProjectDetails() {
  const { slug } = useParams()
  const project = projects.find(item => item.slug === slug)

  if (!project) {
    return (
      <section className="page-section shell">
        <h1 className="page-heading">Project not found.</h1>
        <Link className="text-link" to="/projects"><ArrowLeft size={16} /> Back to projects</Link>
      </section>
    )
  }

  return (
    <section className="page-section shell detail-page">
      <Link className="text-link detail-back" to="/projects"><ArrowLeft size={16} /> All projects</Link>
      <div className="detail-heading">
        <span className="eyebrow">{project.category} / {project.year}</span>
        <h1 className="page-heading">{project.title}<span className="gradient-text">.</span></h1>
        <p className="page-lede">{project.description}</p>
      </div>
      <img className="detail-cover" src={project.cover} alt={project.coverAlt} decoding="async" onError={event => { const image = event.currentTarget; if (project.fallbackCover && !image.dataset.fallbackApplied) { image.dataset.fallbackApplied = 'true'; image.src = project.fallbackCover } }} />
      <p className="projects-note">Screenshot from the live application when available, with an illustrated fallback. Open the working application from the Projects page.</p>
      <div className="detail-content">
        <div>
          <span className="eyebrow">PROJECT OVERVIEW</span>
          <p className="detail-description">{project.longDescription}</p>
        </div>
        <aside className="detail-sidebar">
          <span className="eyebrow">TECHNOLOGIES</span>
          <div className="tag-row detail-tags">
            {project.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
          </div>
          {project.githubUrl && <a className="text-link" href={project.githubUrl} target="_blank" rel="noopener noreferrer">View source on GitHub <ArrowUpRight size={16} /></a>}
        </aside>
      </div>

      {project.paper && (
        <section className="research-paper-section" id="research-paper" aria-labelledby="research-paper-heading">
          <div className="section-kicker">
            <span>RESEARCH & PUBLICATIONS</span>
            <span className="line" />
          </div>
          <div className="research-paper-card">
            <div className="research-paper-icon"><FileText size={27} aria-hidden="true" /></div>
            <div className="research-paper-info">
              <span className="eyebrow">CONFERENCE PAPER / {project.paper.status.toUpperCase()}</span>
              <h2 id="research-paper-heading">Research behind {project.title}</h2>
              <p>
                An accompanying manuscript exploring AI-assisted résumé screening, job matching,
                and career guidance. Discover the research alongside the working application.
              </p>
              <span className="research-paper-author">Authored by <strong>{project.paper.author}</strong></span>
            </div>
            <div className="research-paper-links">
              <a
                className="research-paper-open"
                href={project.paper.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={'Open research manuscript by ' + project.paper.author + ' in a new tab'}
              >
                <span>Read manuscript</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a
                className="research-paper-download"
                href={project.paper.url}
                download="ai-driven-resume-screening.pdf"
                aria-label="Download the research manuscript PDF"
              >
                <Download size={17} aria-hidden="true" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        </section>
      )}

      <Button to="/projects" variant="secondary">Browse all projects</Button>
    </section>
  )
}
