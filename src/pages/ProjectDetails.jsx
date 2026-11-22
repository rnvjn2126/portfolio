import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Download, FileText, Sparkles } from 'lucide-react'
import { EmailTrigger } from '../components/EmailContact'
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
      <Link className="text-link detail-back" to="/projects"><ArrowLeft size={20} aria-hidden="true" /><span>Back to all projects</span></Link>
      <div className="detail-heading">
        <span className="eyebrow">{project.category} / {project.year}</span>
        <h1 className="page-heading">{project.title}<span className="gradient-text">.</span></h1>
        <p className="page-lede">{project.description}</p>
      </div>
      {project.customizable && (
        <section className="erp-custom-banner" aria-label="Custom ERP development">
          <div className="erp-custom-banner-copy">
            <span className="erp-custom-eyebrow"><Sparkles size={16} aria-hidden="true" /> MADE FOR YOUR BUSINESS</span>
            <h2>{project.customizationHeading}</h2>
            <p>{project.customizationDescription}</p>
            <span className="erp-custom-demo-note">The screens below show a working demo. Your version can be designed around your own workflows.</span>
          </div>
          <EmailTrigger className="erp-custom-cta">
            Discuss your ERP needs <ArrowUpRight size={18} aria-hidden="true" />
          </EmailTrigger>
        </section>
      )}

      <img className="detail-cover" src={project.cover} alt={project.coverAlt} decoding="async" onError={event => { const image = event.currentTarget; if (project.fallbackCover && !image.dataset.fallbackApplied) { image.dataset.fallbackApplied = 'true'; image.src = project.fallbackCover } }} />
      <p className="projects-note">
        {project.developmentNote
          ? 'A genuine screenshot from a temporary Django demo with synthetic example records. This project runs locally and is not publicly hosted.'
          : 'Preview of the live application when available, with an illustrated fallback. Use the View live project button below to explore the working project.'}
      </p>
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

      {project.capabilities && (
        <section className="detail-capabilities" aria-labelledby="detail-capabilities-heading">
          <div className="section-kicker">
            <span>WHAT THE APPLICATION DOES</span>
            <span className="line" />
          </div>
          <h2 id="detail-capabilities-heading">Built for real business operations.</h2>
          <div className="detail-capabilities-grid">
            {project.capabilities.map((capability, index) => (
              <div className="detail-capability" key={capability.title}>
                <span className="detail-capability-number">{String(index + 1).padStart(2, '0')}</span>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {project.screenshots && (
        <section className="detail-gallery" aria-labelledby="detail-gallery-heading">
          <div className="section-kicker">
            <span id="detail-gallery-heading">APPLICATION WALKTHROUGH</span>
            <span className="line" />
          </div>
          <p className="detail-gallery-intro">Real screenshots from the running development demo, captured with fictional records and no production customer information.</p>
          <div className="detail-gallery-grid">
            {project.screenshots.map(image => (
              <figure className="detail-gallery-item" key={image.src}>
                <a href={image.src} target="_blank" rel="noopener noreferrer" aria-label={'Open full size screenshot: ' + image.label}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    onError={event => {
                      const figure = event.currentTarget.closest('figure')
                      if (figure) figure.hidden = true
                    }}
                  />
                </a>
                <figcaption>{image.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

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

      <div className="detail-bottom-actions">
        {project.liveUrl ? (
          <a
            className="detail-live-button"
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={'View live ' + project.title + ' website in a new tab'}
          >
            <span>View live project</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        ) : project.customizable ? (
          <EmailTrigger className="detail-live-button" aria-label="Discuss building an ERP to your specifications">
            <span>Discuss your ERP</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </EmailTrigger>
        ) : project.githubUrl ? (
          <a
            className="detail-live-button"
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={'View ' + project.title + ' source code in a new tab'}
          >
            <span>View project source</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        ) : (
          <Link className="detail-live-button" to="/projects">
            <span>Explore other projects</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        )}
        <Button to="/projects" variant="secondary" magnetic={false}>Browse all projects</Button>
      </div>
    </section>
  )
}
