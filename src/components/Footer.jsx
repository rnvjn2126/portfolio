import { ArrowUpRight } from 'lucide-react'
import { site } from '../data/site'

export default function Footer() {
  return (
    <footer className="footer shell">
      <div className="footer-top">
        <div><span className="eyebrow">HAVE A GOOD ONE IN MIND?</span><h2>Let's make it<br/><span className="muted">happen.</span></h2></div>
        <a className="footer-mail" href={`mailto:${site.email}`}>{site.email}<ArrowUpRight size={20}/></a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        <div>{site.socials.map(s => <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label} ↗</a>)}</div>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  )
}
