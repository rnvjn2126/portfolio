
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
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { projects } from '../data/projects'
import Reveal from '../components/Reveal'
import Button from '../components/Button'
import ProjectCard from '../components/ProjectCard'
import HeroCar3D from '../components/HeroCar3D'
import { Stagger, StaggerItem, SpotlightCard, TiltCard } from '../components/MotionPrimitives'





function Hero() {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, .8], [1, 0])

  return (
    <section className="hero shell" ref={ref}>
      <aside className="hero-feature" aria-label="Services at a glance">
        <span>WHAT I BRING TO THE TABLE</span>
        <strong>Ideas, refined into experiences.</strong>
        <ul>
          <li><span>01</span> Business websites</li>
          <li><span>02</span> Useful digital tools</li>
          <li><span>03</span> Interface design</li>
        </ul>
      </aside>

      <motion.div className="hero-content" style={{ opacity }}>
        <div className="eyebrow hero-eyebrow">
          <span className="status-dot" />
          {site.availability}
        </div>

        <h1>
          {site.headline[0]}
          <br />
          <span className="gradient-text">{site.headline[1]}</span>
        </h1>

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

      <div className="hero-visual" aria-label="Interactive Formula 1 car showcase">
        <div className="hero-visual__heading"><span>INTERACTIVE DETAIL / 001</span><span>ENGINEERING MEETS CURIOSITY</span></div>
        <HeroCar3D />
        <div className="hero-visual__footer"><span>FORMULA 1 / EXPLODED VIEW</span><span>HOVER OR FOCUS TO EXPLORE</span></div>
      </div>
      <div className="hero-bottom">
        <span>SCROLL TO EXPLORE <ArrowDown size={14} /></span>
        <span>{site.location}</span>
      </div>

    </section>
  )
}

function CoffeeHeartArt() {
  return (
    <figure
      className="coffee-art"
      role="img"
      aria-label="Milk is poured into a cup of coffee and forms a heart in the latte art."
    >
      <svg viewBox="0 0 260 190" aria-hidden="true">
        <defs>
          <linearGradient id="coffee-ceramic" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#fffdf8" />
            <stop offset=".28" stopColor="#e9e2d9" />
            <stop offset=".68" stopColor="#b6aea6" />
            <stop offset="1" stopColor="#f7f0e7" />
          </linearGradient>
          <linearGradient id="coffee-cup-shade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#77716d" stopOpacity=".05" />
            <stop offset=".52" stopColor="#fff" stopOpacity=".35" />
            <stop offset="1" stopColor="#504a46" stopOpacity=".24" />
          </linearGradient>
          <radialGradient id="coffee-crema" cx=".34" cy=".2" r=".88">
            <stop offset="0" stopColor="#aa7043" />
            <stop offset=".34" stopColor="#78472c" />
            <stop offset=".76" stopColor="#45271b" />
            <stop offset="1" stopColor="#261812" />
          </radialGradient>
          <linearGradient id="coffee-metal" x1="0" x2="1">
            <stop offset="0" stopColor="#62666b" />
            <stop offset=".22" stopColor="#b9bdc0" />
            <stop offset=".42" stopColor="#f3f2ef" />
            <stop offset=".68" stopColor="#92969a" />
            <stop offset="1" stopColor="#52565b" />
          </linearGradient>
          <linearGradient id="coffee-foam" x1=".2" x2=".8" y1="0" y2="1">
            <stop offset="0" stopColor="#fffdf4" />
            <stop offset=".58" stopColor="#f5e6ca" />
            <stop offset="1" stopColor="#e7c9a0" />
          </linearGradient>
          <linearGradient id="coffee-milk" x1="0" x2="1">
            <stop offset="0" stopColor="#e9d8bd" />
            <stop offset=".5" stopColor="#fffdf5" />
            <stop offset="1" stopColor="#e4d1b3" />
          </linearGradient>
          <clipPath id="coffee-surface-clip">
            <ellipse cx="130" cy="82" rx="70" ry="29" />
          </clipPath>
        </defs>

        <ellipse className="coffee-art__shadow" cx="130" cy="151" rx="103" ry="22" />
        <ellipse className="coffee-art__saucer" cx="130" cy="143" rx="103" ry="27" />
        <ellipse className="coffee-art__saucer-inset" cx="130" cy="140" rx="91" ry="21" />
        <path className="coffee-art__saucer-groove" d="M43 143 C68 160 193 166 218 143" />
        <path className="coffee-art__handle-shadow" d="M204 91 C246 81 252 124 222 139 C215 142 208 139 202 135" />
        <path className="coffee-art__handle" d="M204 91 C246 81 252 124 222 139 C215 142 208 139 202 135" />
        <path className="coffee-art__cup" d="M44 83 C48 140 71 163 130 163 C189 163 212 140 216 83 Z" />
        <path className="coffee-art__cup-shade" d="M48 91 C56 135 80 154 130 156 C180 154 204 135 212 91 C195 116 65 116 48 91 Z" />
        <path className="coffee-art__cup-highlight" d="M61 111 C67 138 88 151 112 153" />
        <ellipse className="coffee-art__rim" cx="130" cy="83" rx="86" ry="38" />
        <ellipse className="coffee-art__surface" cx="130" cy="82" rx="70" ry="29" />
        <g clipPath="url(#coffee-surface-clip)">
          <ellipse className="coffee-art__surface-glint" cx="105" cy="71" rx="38" ry="10" />
          <path className="coffee-art__crema" d="M72 85 C91 62 111 57 133 59 C154 61 172 72 187 86" />
          <path className="coffee-art__crema-swirl" d="M80 91 C98 76 119 72 143 77 C158 80 171 87 180 95" />
          <circle className="coffee-art__bubble" cx="76" cy="78" r="1.7" />
          <circle className="coffee-art__bubble" cx="84" cy="67" r="1.1" />
          <circle className="coffee-art__bubble" cx="171" cy="66" r="1.4" />
          <circle className="coffee-art__bubble" cx="183" cy="82" r="1.8" />
          <g className="coffee-art__ripples">
            <ellipse className="coffee-art__ripple coffee-art__ripple--one" cx="130" cy="83" rx="13" ry="5" />
            <ellipse className="coffee-art__ripple coffee-art__ripple--two" cx="130" cy="83" rx="22" ry="8" />
          </g>
        </g>

        <g className="coffee-art__steam">
          <path d="M94 55 C88 48 100 44 95 36 C92 31 96 28 99 24" />
          <path d="M130 51 C124 44 136 39 131 31 C128 27 132 23 135 20" />
          <path d="M164 54 C159 47 170 42 167 35 C165 31 168 28 171 25" />
        </g>

        <g className="coffee-art__pitcher">
          <path className="coffee-art__pitcher-handle" d="M216 10 C237 6 240 22 221 29" />
          <path className="coffee-art__pitcher-body" d="M182 8 C181 6 184 5 188 6 L215 7 C219 7 220 10 218 14 L215 23 C207 29 196 31 187 26 L180 16 Z" />
          <path className="coffee-art__pitcher-rim" d="M183 8 C192 4 207 5 218 8" />
          <path className="coffee-art__pitcher-glint" d="M188 11 L191 22" />
          <path className="coffee-art__spout" d="M184 20 C174 23 164 30 155 39" />
        </g>

        <path className="coffee-art__milk" d="M155 39 C145 50 135 64 130 82" />
        <path className="coffee-art__milk-glint" d="M153 41 C144 52 136 65 131 79" />
        <g className="coffee-art__heart">
          <path d="M130 109 C120 101 103 91 102 81 C101 70 114 66 123 74 C126 76 128 79 130 83 C136 72 147 68 154 76 C163 86 151 98 130 109 Z" />
          <path className="coffee-art__heart-highlight" d="M109 79 C111 72 118 71 123 76 M148 77 C153 79 154 83 152 87" />
          <path className="coffee-art__heart-detail" d="M130 83 C127 92 128 101 130 106" />
        </g>
      </svg>
      <figcaption>LATTE ART, IN THE MAKING</figcaption>
    </figure>
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
          <div className="about-heading-art">
            <h2 className="section-heading">
              Curiosity meets
              <br />
              <span className="muted">craft.</span>
            </h2>
            <div className="about-principles">
              <span>MY APPROACH</span>
              <div><b>01</b><strong>Understand the real problem</strong></div>
              <div><b>02</b><strong>Design for clarity</strong></div>
              <div><b>03</b><strong>Build with care</strong></div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={.12}>
          <div className="about-copy">
            <p className="large-copy">
              I care about the details people feel, even when they can't quite explain why.
            </p>

            <p className="body-copy">
              My work moves between web development, interface design and practical AI experiments. I enjoy taking an idea from its first rough sketch to something people can actually use, always keeping clarity and reliability in focus.
            </p>

            <Link className="text-link" to="/#contact">
              More about me <ArrowUpRight size={16} />
            </Link>
            <div className="about-coffee-wrap"><CoffeeHeartArt /></div>
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
            A selection of business websites, practical AI tools and workflow software built to solve real problems.
          </p>
        </Reveal>
      </div>

      <Stagger className="project-grid" stagger={0.12}>
        {projects.filter(p => p.featured).map((project, i) => (
          <StaggerItem key={project.slug}>
            <SpotlightCard className="project-spotlight">
              <TiltCard className="project-tilt">
                <ProjectCard project={project} index={i} />
              </TiltCard>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="center-action work-cta-stack">
        <div className="work-live-actions" aria-label="Visit live projects">
          {projects.filter(project => project.featured && project.liveUrl).map(project => (
            <Button
              key={project.slug}
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              magnetic={false}
              aria-label={'Visit live ' + project.title + ' project in a new tab'}
            >
              View live: {project.title}
            </Button>
          ))}
        </div>
        <Button to="/projects" variant="secondary" magnetic={false}>
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
        <div className="research-topbar">
          <span>03 / RESEARCH</span>
          <span>SELECTED PUBLICATION</span>
        </div>

        <div className="research-status-row">
          <span className="research-type">CONFERENCE PAPER</span>
          <span className="research-unpublished">
            <span className="research-status-dot" />
            UNPUBLISHED MANUSCRIPT
          </span>
        </div>

        <h2 className="section-heading research-main-heading">
          <Link className="research-heading-link" to="/projects/Career AI Pro">
            Research & Publications <ArrowUpRight size={25} aria-hidden="true" />
          </Link>
        </h2>

        <Link
          className="research-publication research-publication--link"
          to="/projects/Career AI Pro"
          aria-label="Explore the Career AI Pro research paper and project details"
        >
          <div className="research-author">
            <span className="research-author-label">AUTHORED BY</span>
            <span className="research-author-name">Aarnav Jain</span>
            <span className="research-project-caption">Career AI Pro · Related research manuscript</span>
          </div>
          <span className="research-manuscript-link">
            <span>Explore research paper</span>
            <ArrowUpRight size={20} />
          </span>
        </Link>
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
                  <span>@aarnav_jain.21</span>
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
