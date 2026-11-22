import { ArrowUpRight } from 'lucide-react'
import { site } from '../data/site'
import { Link } from 'react-router-dom'
import { EmailTrigger } from './EmailContact'

export default function Footer() {
  return (
    <footer className="footer shell">
      <div className="footer-top">
        <div className="footer-pitch">
          <span className="eyebrow footer-eyebrow">
            <span className="footer-eyebrow-mark" aria-hidden="true" />
            HAVE A GOOD ONE IN MIND?
          </span>
          <h2>Let's make it<br/><span className="muted">happen.</span></h2>
          <p className="footer-description">A website, an idea or software built around your business. Let's talk about what you're imagining.</p>
        </div>
        <EmailTrigger className="footer-mail" aria-label={'Contact me by email: ' + site.email}>
          <span className="footer-mail-copy">
            <strong>Start a conversation</strong>
            <span>{site.email}</span>
          </span>
          <ArrowUpRight size={23} aria-hidden="true" />
        </EmailTrigger>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        <div>{site.socials.map(s => <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label} ↗</a>)}<Link to="/privacy">Privacy</Link></div>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  )
}
