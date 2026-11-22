import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { Magnetic } from './MotionPrimitives'
const MotionLink = motion.create(Link)
export default function Button({ children, to, href, variant = 'primary', icon = true, magnetic = true, ...props }) {
  const reduce = useReducedMotion(), className = `button button-${variant}`
  const motionProps = reduce ? {} : { whileHover: { y: -2, scale: 1.015 }, whileTap: { scale: .985 }, transition: { type: 'spring', stiffness: 420, damping: 25 } }
  const content = <>{children}{icon && <ArrowUpRight size={16} />}</>
  let control
  if (to) control = <MotionLink to={to} className={className} {...motionProps} {...props}>{content}</MotionLink>
  else if (href) control = <motion.a href={href} className={className} {...motionProps} {...props}>{content}</motion.a>
  else control = <motion.button className={className} {...motionProps} {...props}>{content}</motion.button>
  return magnetic && !reduce ? <Magnetic className="magnetic-wrap">{control}</Magnetic> : control
}
