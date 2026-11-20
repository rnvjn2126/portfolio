import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  icon = true,
  ...props
}) {
  const className = `button button-${variant}`

  const content = (
    <>
      {children}
      {icon && <ArrowUpRight size={16} />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={className} {...props}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={className} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button className={className} {...props}>
      {content}
    </button>
  )
}

