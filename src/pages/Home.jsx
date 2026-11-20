
import {
  ArrowDown,
  ArrowUpRight,
  MoveUpRight,
  Sparkles,
  FileText,
  Instagram,
  Mail,
} from 'lucide-react'

import { motion, useScroll, useTransform } from 'motion/react'
import { lazy, Suspense, useRef } from 'react'
import { site } from '../data/site'
import { projects } from '../data/projects'
import Reveal from '../components/Reveal'
import Button from '../components/Button'
import ProjectCard from '../components/ProjectCard'

const HeroCar3D = lazy(() => import('../components/HeroCar3D'))

const paperUrl = 'https://ieee-shortened-format.tiiny.site/?mode=suggestions'

function Hero() {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '24%'])
  const opacity = useTransform(scrollYProgress, [0, .8], [1, 0])

  return (
    <section className="hero shell" ref={ref}>
      <motion.div className="hero-glow" style={{ y }} />

      <Suspense fallback={null}>
        <HeroCar3D />
      </Suspense>

      <motion.div className="hero-content" style={{ opacity }}>
        <div className="eyebrow hero-eyebrow">
          <span className="status-dot" />
          {site.availability}
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .9, ease: [.2, .8, .2, 1] }}
        >
          {site.headline[0]}
          <br />
          <span className="gradient-text">{site.headline[1]}</span>
        </motion.h1>

        <motion.p
          className="hero-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .35, duration: .8 }}
        >
          {site.intro}
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .5 }}
        >
          <Button to="/projects">Explore my work</Button>

          <a className="text-link" href="#contact">
            Contact <MoveUpRight size={16} />
          </a>
        </motion.div>
      </motion.div>

      <div className="hero-bottom">
        <span>SCROLL TO EXPLORE <ArrowDown size={14} /></span>
        <span>{site.location}</span>
      </div>

      <div className="hero-orbit orbit-one" />
      <div className="hero-orbit orbit-two" />
    </section>
  )
}

function About() {
  return (
    <section className="section shell about-section" id="about">
      <Reveal>
        <div className="section-kicker">
          <span>01 / ABOUT</span>
          <span className="line" />
        </div>
      </Reveal>

      <div className="about-grid">
        <Reveal>
          <h2 className="section-heading">
            Curiosity meets
            <br />
            <span className="muted">craft.</span>
          </h2>
        </Reveal>

        <Reveal delay={.12}>
          <div className="about-copy">
            <p className="large-copy">
              I care about the details people feel, even when they can't quite explain why.
            </p>

            <p className="body-copy">
              I bring ideas to life through thoughtful design, purposeful interaction and clean, dependable code. This is where you can add your story, experience and the kind of work you love doing.
            </p>

            <a className="text-link" href={`mailto:${site.email}`}>
              More about me <ArrowUpRight size={16} />
            </a>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="skills-strip">
          <span className="eyebrow">TOOLS OF THE TRADE</span>
          <div>
            {site.skills.map(skill => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Work() {
  return (
    <section className="section shell work-section" id="work">
      <div className="section-kicker">
        <span>02 / SELECTED WORK</span>
        <span className="line" />
      </div>

      <div className="section-title-row">
        <Reveal>
          <h2 className="section-heading">
            A few things
            <br />
            <span className="muted">I've made.</span>
          </h2>
        </Reveal>

        <Reveal>
          <p className="body-copy">
            A selection of experiments, collaborations and digital products. Replace these sample projects with your own accomplishments.
          </p>
        </Reveal>
      </div>

      <div className="project-grid">
        {projects.filter(p => p.featured).map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>

      <div className="center-action">
        <Button to="/projects" variant="secondary">
          View all projects
        </Button>
      </div>
    </section>
  )
}

function Research() {
  return (
    <section className="section shell research-section" id="research">
      <Reveal>
        <div className="section-kicker">
          <span>03 / RESEARCH</span>
          <span className="line" />
        </div>

        <div className="research-content">
          <div>
            <span className="eyebrow">
              <FileText size={14} /> CONFERENCE PAPER
            </span>

            <h2 className="section-heading">
              Research &
              <br />
              <span className="muted">Publications.</span>
            </h2>
          </div>

          <div className="research-author">
            <a
              href={paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link research-author-link"
            >
              Aarnav Jain <ArrowUpRight size={18} />
            </a>

            <p className="body-copy">
              Conference paper manuscript · Not yet published
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Services() {
  return (
    <section className="section shell services-section" id="services">
      <div className="section-kicker">
        <span>04 / WHAT I DO</span>
        <span className="line" />
      </div>

      <div className="section-title-row">
        <h2 className="section-heading">
          Good work starts
          <br />
          <span className="muted">with a good plan.</span>
        </h2>

        <p className="body-copy">
          From a first sketch to a polished launch, I can help move your next idea forward.
        </p>
      </div>

      <div className="service-list">
        {site.services.map(service => (
          <Reveal key={service.number}>
            <div className="service-row">
              <span className="service-number">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ArrowUpRight className="service-arrow" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  const instagram = site.socials.find(
    social => social.label === 'Instagram'
  )

  return (
    <section className="contact-section shell" id="contact">
      <Reveal>
        <div className="contact-panel">
          <div className="contact-orb" />

          <span className="eyebrow">
            <Sparkles size={14} /> GET IN TOUCH
          </span>

          <h2>
            Let's connect
            <br />
            <span className="gradient-text">with each other.</span>
          </h2>

          <p>
            You can reach me through email or connect with me on Instagram.
          </p>

          <div className="contact-links">
            {/* Email card */}
            <a
              className="contact-card email-card"
              href={`mailto:${site.email}`}
            >
              <span className="contact-card-hover-art" aria-hidden="true">
                <Mail size={115} />
              </span>

              <span className="contact-card-icon">
                <Mail size={25} />
              </span>

              <span className="contact-card-text">
                <strong>Email</strong>
                <span>{site.email}</span>
              </span>

              <ArrowUpRight
                className="contact-card-arrow"
                size={22}
              />
            </a>

            {/* Instagram card */}
            {instagram && (
              <a
                className="contact-card instagram-card"
                href={instagram.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact-card-hover-art" aria-hidden="true">
                  <Instagram size={115} />
                </span>

                <span className="contact-card-icon">
                  <Instagram size={25} />
                </span>

                <span className="contact-card-text">
                  <strong>Instagram</strong>
                  <span>@aarnav_jain.</span>
                </span>

                <ArrowUpRight
                  className="contact-card-arrow"
                  size={22}
                />
              </a>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Work />
      <Research />
      <Services />
      <Contact />
    </>
  )
}
