
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
import { useRef, useState } from 'react'
import { site } from '../data/site'
import { projects } from '../data/projects'
import Reveal from '../components/Reveal'
import Button from '../components/Button'
import ProjectCard from '../components/ProjectCard'

const paperUrl = 'https://ieee-shortened-format.tiiny.site/?mode=suggestions'

function Hero() {
  const ref = useRef(null)
  const [carDisassembled, setCarDisassembled] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '24%'])
  const opacity = useTransform(scrollYProgress, [0, .8], [1, 0])

  return (
    <section className="hero shell" ref={ref}>
      <motion.div className="hero-glow" style={{ y }} />

      <button
        className={`hero-car${carDisassembled ? ' is-disassembled' : ''}`}
        type="button"
        aria-label={carDisassembled ? 'Reassemble the toy race car' : 'Disassemble the toy race car'}
        aria-pressed={carDisassembled}
        onClick={() => setCarDisassembled(!carDisassembled)}
      >
        <svg viewBox="0 0 360 170" aria-hidden="true">
          <g className="toy-car__wheel toy-car__wheel--rear">
            <circle cx="89" cy="119" r="22" />
            <circle className="toy-car__rim" cx="89" cy="119" r="9" />
            <circle className="toy-car__hub" cx="89" cy="119" r="3" />
          </g>
          <g className="toy-car__wheel toy-car__wheel--front">
            <circle cx="279" cy="119" r="22" />
            <circle className="toy-car__rim" cx="279" cy="119" r="9" />
            <circle className="toy-car__hub" cx="279" cy="119" r="3" />
          </g>
          <g className="toy-car__chassis">
            <path d="M43 105h278l-7 19H47z" />
            <path className="toy-car__chassis-detail" d="M125 117h117" />
          </g>
          <g className="toy-car__shell">
            <path d="m43 107 8-20q3-8 14-10l53-7 28-29q8-8 20-8h43q15 0 26 12l29 31 39 8q12 3 15 14l4 14H43z" />
            <path className="toy-car__stripe" d="m53 93 47-5-7 8-43 5z" />
            <path className="toy-car__light" d="m303 91 15 5 3 8h-18z" />
          </g>
          <g className="toy-car__glass">
            <path d="m133 68 22-23q4-4 11-4h14v27z" />
            <path d="M188 41h18q11 0 19 9l17 18h-54z" />
          </g>
          <g className="toy-car__spoiler">
            <path d="M56 77h8l-3 15h-7z" />
            <path d="M48 75h25v5H48z" />
          </g>
        </svg>
        <span>{carDisassembled ? 'Click to reassemble' : 'Click to disassemble'}</span>
      </button>

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
