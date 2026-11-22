import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useScroll } from 'motion/react'

const revealEase = [0.22, 1, 0.36, 1]
export function Stagger({ children, className = '', delay = 0, stagger = 0.09, ...props }) {
  const reduce = useReducedMotion()
  return <motion.div className={className} initial={reduce ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={{ hidden: {}, visible: { transition: { delayChildren: reduce ? 0 : delay, staggerChildren: reduce ? 0 : stagger } } }} {...props}>{children}</motion.div>
}
export function StaggerItem({ children, className = '', ...props }) {
  const reduce = useReducedMotion()
  return <motion.div className={className} variants={{ hidden: { opacity: 0, y: reduce ? 0 : 24, filter: reduce ? 'none' : 'blur(7px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: reduce ? 0 : 0.72, ease: revealEase } } }} {...props}>{children}</motion.div>
}
export function TextReveal({ text, className = '', delay = 0, as = 'span' }) {
  const reduce = useReducedMotion()
  const Tag = motion[as] || motion.span
  return <Tag className={className} aria-label={text} initial={reduce ? false : 'hidden'} animate="visible" variants={{ hidden: {}, visible: { transition: { delayChildren: reduce ? 0 : delay, staggerChildren: reduce ? 0 : 0.075 } } }}>{String(text).split(' ').map((word, index) => <motion.span key={word + index} aria-hidden="true" style={{ display: 'inline-block', marginRight: '0.24em' }} variants={{ hidden: { opacity: 0, y: reduce ? 0 : 28, filter: reduce ? 'none' : 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: reduce ? 0 : 0.72, ease: revealEase } } }}>{word}</motion.span>)}</Tag>
}
export function Magnetic({ children, className = '', strength = 0.22, ...props }) {
  const ref = useRef(null), reduce = useReducedMotion(), rawX = useMotionValue(0), rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 260, damping: 18, mass: 0.35 }), y = useSpring(rawY, { stiffness: 260, damping: 18, mass: 0.35 })
  const move = e => { if (reduce || !ref.current || e.pointerType === 'touch') return; const r = ref.current.getBoundingClientRect(); rawX.set((e.clientX-r.left-r.width/2)*strength); rawY.set((e.clientY-r.top-r.height/2)*strength) }
  const reset = () => { rawX.set(0); rawY.set(0) }
  return <motion.div ref={ref} className={className} style={reduce ? undefined : { x, y }} onPointerMove={move} onPointerLeave={reset} {...props}>{children}</motion.div>
}
export function SpotlightCard({ children, className = '', ...props }) {
  const ref = useRef(null)
  const move = e => { if (!ref.current || e.pointerType === 'touch') return; const r=ref.current.getBoundingClientRect(); ref.current.style.setProperty('--spotlight-x', `${e.clientX-r.left}px`); ref.current.style.setProperty('--spotlight-y', `${e.clientY-r.top}px`) }
  return <div ref={ref} className={`spotlight-card ${className}`} onPointerMove={move} {...props}>{children}</div>
}
export function TiltCard({ children, className = '', maxTilt = 5, ...props }) {
  const ref=useRef(null), reduce=useReducedMotion(), rx=useMotionValue(0), ry=useMotionValue(0)
  const sx=useSpring(rx,{stiffness:180,damping:20}), sy=useSpring(ry,{stiffness:180,damping:20})
  const move=e=>{if(reduce||!ref.current||e.pointerType==='touch')return;const r=ref.current.getBoundingClientRect();rx.set((.5-(e.clientY-r.top)/r.height)*maxTilt);ry.set(((e.clientX-r.left)/r.width-.5)*maxTilt)}
  const reset=()=>{rx.set(0);ry.set(0)}
  return <motion.div ref={ref} className={className} style={reduce?undefined:{rotateX:sx,rotateY:sy,transformPerspective:900}} onPointerMove={move} onPointerLeave={reset} {...props}>{children}</motion.div>
}
export function ScrollProgress() {
  const reduce=useReducedMotion(), {scrollYProgress}=useScroll(), scaleX=useSpring(scrollYProgress,{stiffness:100,damping:30,restDelta:.001})
  if(reduce)return null
  return <motion.div className="scroll-progress__fill" aria-hidden="true" style={{scaleX}}/>
}
