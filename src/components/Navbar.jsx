import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { site } from '../data/site'

const links = [{ label: 'Home', to: '/' }, { label: 'Projects', to: '/projects' }, { label: 'Contact', to: '/#contact' }]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <nav className="nav shell">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">{site.initials}</span><span>{site.name}<i>.</i></span>
        </Link>
        <div className={`nav-links ${open ? 'is-open' : ''}`}>
          {links.map(link => <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>{link.label}</NavLink>)}
        </div>
        <button className="menu-toggle" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      </nav>
    </header>
  )
}
