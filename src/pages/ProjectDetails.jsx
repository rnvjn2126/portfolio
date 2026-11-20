
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, FileText } from 'lucide-react'
import { projects } from '../data/projects'
import Button from '../components/Button'

const paperUrl = 'https://ieee-shortened-format.tiiny.site/?mode=suggestions'

export default function ProjectDetails() {
  const { slug } = useParams()
  const project = projects.find(p => p.slug === slug)

  if (!project) {
    return (
      <section className="page-section shell">
        <h1 className="page-heading">Project not found.</h1>
        <Link className="text-link" to="/projects">
          <ArrowLeft size={16} /> Back to projects
        </Link>
      </section>
    )
  }

  const isCareerAIPro = project.slug === 'Career AI Pro'

  return (
    <section className="page-section shell detail-page">
      <Link className="text-link" to="/projects">
        <ArrowLeft size={16} /> All projects
      </Link>

      <div className="detail-heading">
        <span className="eyebrow">
          {project.category} · {project.year}
        </span>

        <h1 className="page-heading">
          {project.title}
          <span className="gradient-text">.</span>
        </h1>

        <p className="page-lede">{project.description}</p>
      </div>

      <img
        className="detail-cover"
        src={project.cover}
        alt={`${project.title} project`}
      />

      <div className="detail-content">
        <div>
          <span className="eyebrow">BUILT WITH</span>

          <div className="tag-row detail-tags">
            {project.tags.map(tag => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>

          {project.githubUrl && (
            <p>
              <a
                className="text-link"
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View GitHub repository <ArrowUpRight size={16} />
              </a>
            </p>
          )}

          {project.liveUrl && (
            <p>
              <a
                className="text-link"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit live project <ArrowUpRight size={16} />
              </a>
            </p>
          )}
        </div>
      </div>

      {isCareerAIPro && (
        <div className="research-paper-section">
          <div className="section-kicker">
            <span>RESEARCH & PUBLICATIONS</span>
            <span className="line" />
          </div>

          <div className="research-paper-card">
            <div className="research-paper-icon">
              <FileText size={24} />
            </div>

            <div className="research-paper-info">
              <span className="eyebrow">
                CONFERENCE PAPER · UNPUBLISHED MANUSCRIPT
              </span>

              <h2>Research Paper</h2>

              <a
                href={paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Aarnav Jain <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      )}

      <Button to="/projects" variant="secondary">
        Explore more projects
      </Button>
    </section>
  )
}
