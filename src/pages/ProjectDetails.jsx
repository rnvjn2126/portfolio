import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, FileText } from 'lucide-react'
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
      <img className="detail-cover" src={project.cover} alt={project.coverAlt} decoding="async" />
      <p className="projects-note">Illustrative project artwork. The real, working application is linked directly on the Projects page.</p>
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
        <div className="research-paper-section">
          <div className="section-kicker"><span>RESEARCH & PUBLICATIONS</span><span className="line" /></div>
          <div className="research-paper-card">
            <div className="research-paper-icon"><FileText size={24} /></div>
            <div className="research-paper-info">
              <span className="eyebrow">CONFERENCE PAPER / {project.paper.status.toUpperCase()}</span>
              <h2>Related research manuscript</h2>
              <a href={project.paper.url} target="_blank" rel="noopener noreferrer" className="text-link">
                {project.paper.author} <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      )}

      <Button to="/projects" variant="secondary">Browse all projects</Button>
    </section>
  )
}
