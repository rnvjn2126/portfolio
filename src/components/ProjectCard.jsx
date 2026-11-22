import { ArrowUpRight, Github } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
export default function ProjectCard({ project, index = 0 }) {
  const reduce = useReducedMotion()
  return <motion.article className="project-card" initial={{ opacity: 0, y: reduce ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} whileHover={reduce ? undefined : { y: -6 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: reduce ? 0.01 : 0.65, delay: reduce ? 0 : (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}>
    <Link to={`/projects/${project.slug}`} className="project-image-wrap"><motion.img src={project.cover} alt={`${project.title} preview`} className="project-image" whileHover={reduce ? undefined : { scale: 1.045 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} /><span className="image-arrow"><ArrowUpRight size={20} /></span></Link>
    <div className="project-meta"><span>{project.category}</span><span>{project.year}</span></div>
    <Link to={`/projects/${project.slug}`} className="project-title-link"><h3>{project.title}<ArrowUpRight size={19} /></h3></Link>
    <p>{project.description}</p><div className="tag-row">{project.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div>
    {project.githubUrl && <a className="github-project-link" href={project.githubUrl} target="_blank" rel="noopener noreferrer"><Github size={16} />View source code<ArrowUpRight size={14} /></a>}
  </motion.article>
}
