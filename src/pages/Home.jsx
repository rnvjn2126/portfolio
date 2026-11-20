
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
          <defs>
            <linearGradient id="racecar-paint" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ff8d8a" />
              <stop offset=".18" stopColor="#f04d58" />
              <stop offset=".58" stopColor="#bf1e32" />
              <stop offset="1" stopColor="#68101f" />
            </linearGradient>
            <linearGradient id="racecar-glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#a8e4f2" />
              <stop offset=".25" stopColor="#4d819b" />
              <stop offset="1" stopColor="#172233" />
            </linearGradient>
            <radialGradient id="racecar-tire">
              <stop offset=".58" stopColor="#292a30" />
              <stop offset=".8" stopColor="#101115" />
              <stop offset="1" stopColor="#3e3f47" />
            </radialGradient>
            <linearGradient id="racecar-rim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f5f2ea" />
              <stop offset=".45" stopColor="#9296a0" />
              <stop offset="1" stopColor="#444750" />
            </linearGradient>
          </defs>
          <g className="toy-car__wheel toy-car__wheel--rear">
            <circle cx="89" cy="119" r="22" />
            <circle className="toy-car__tire-inset" cx="89" cy="119" r="15" />
            <circle className="toy-car__rim" cx="89" cy="119" r="9" />
            <path className="toy-car__spokes" d="M89 112v14m-7-7h14m-12-5 10 10m0-10-10 10" />
            <circle className="toy-car__hub" cx="89" cy="119" r="3" />
          </g>
          <g className="toy-car__wheel toy-car__wheel--front">
            <circle cx="279" cy="119" r="22" />
            <circle className="toy-car__tire-inset" cx="279" cy="119" r="15" />
            <circle className="toy-car__rim" cx="279" cy="119" r="9" />
            <path className="toy-car__spokes" d="M279 112v14m-7-7h14m-12-5 10 10m0-10-10 10" />
            <circle className="toy-car__hub" cx="279" cy="119" r="3" />
          </g>
          <g className="toy-car__chassis">
            <path d="M43 107h280l-7 16H47z" />
            <path className="toy-car__chassis-detail" d="M125 117h117m-96 6-5 4m83-4 5 4" />
          </g>
          <g className="toy-car__shell">
            <path d="M43 107 51 87q3-8 14-10l53-7 28-25q9-8 23-8h38q16 0 28 13l25 24 41 8q12 3 17 15l5 11-5 6h-15c-3-30-45-30-48 0H113c-3-30-45-30-48 0H46z" />
            <path className="toy-car__body-reflection" d="m71 81 48-7 29-25q8-7 19-7h38q12 0 22 10l-18-5h-42q-10 0-17 8l-26 26-54 8z" />
            <path className="toy-car__stripe" d="m53 93 47-5-7 8-43 5z" />
            <path className="toy-car__door-seam" d="m187 76-5 34m45-33 10 2 3 3" />
            <path className="toy-car__handle" d="m198 83 11-1" />
            <path className="toy-car__tail-light" d="m52 88 8-2-2 9-9 2z" />
            <path className="toy-car__light" d="m305 88 12 4 5 10h-17z" />
            <path className="toy-car__grille" d="m310 105 13 1 1 5h-15z" />
          </g>
          <g className="toy-car__glass">
            <path d="m133 68 22-23q4-4 11-4h14v27z" />
            <path d="M188 41h18q11 0 19 9l17 18h-54z" />
            <path className="toy-car__glass-shine" d="m139 65 20-20q3-2 8-2h3l-22 22zm53-21 12-1q10 1 17 9l11 12h-8l-20-18z" />
            <path className="toy-car__window-frame" d="m183 41 1 29" />
          </g>
          <g className="toy-car__spoiler">
            <path d="M56 77h8l-3 15h-7z" />
            <path d="M48 75h25v5H48z" />
            <path className="toy-car__spoiler-highlight" d="M51 76h19" />
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
