import { useEffect, useRef } from 'react'

/**
 * A short, fading olive brush stroke following mouse/pen movement.
 * The transparent canvas never intercepts clicks, dragging, or hover,
 * including the interactive Formula 1 model.
 */
export default function CursorBrushTrail() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const lifetime = 320
    const maximumLength = 90
    const maximumPoints = 36
    let points = []
    let frame = 0
    let previous = null
    let active = false
    let pixelRatio = 1

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * pixelRatio)
      canvas.height = Math.round(window.innerHeight * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
      points = []
      previous = null
    }

    const stop = () => {
      points = []
      previous = null
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }

    const render = (now) => {
      frame = 0
      const width = window.innerWidth
      const height = window.innerHeight
      context.clearRect(0, 0, width, height)
      points = points.filter(point => now - point.time < lifetime)

      if (points.length > 1) {
        context.lineCap = 'round'
        context.lineJoin = 'round'
        // Each small segment fades independently, creating a tapered,
        // hand-painted line instead of a persistent line or large glow.
        for (let index = 1; index < points.length; index += 1) {
          const from = points[index - 1]
          const to = points[index]
          const freshness = Math.max(0, 1 - (now - to.time) / lifetime)
          if (freshness <= 0) continue
          context.beginPath()
          context.moveTo(from.x, from.y)
          context.lineTo(to.x, to.y)
          context.lineWidth = 1 + 2.4 * freshness
          context.strokeStyle = `rgba(87, 111, 61, ${(0.43 * freshness * freshness).toFixed(3)})`
          context.stroke()
        }
      }

      if (points.length > 0) frame = window.requestAnimationFrame(render)
    }

    const onMove = (event) => {
      if (!active || (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return
      const x = event.clientX
      const y = event.clientY
      const time = performance.now()

      if (previous) {
        const distance = Math.hypot(x - previous.x, y - previous.y)
        if (distance < 2) return
        // Never draw a distracting line across the whole screen when
        // the pointer suddenly jumps or re-enters the browser.
        if (distance > 130 || time - previous.time > 140) points = []
      }

      const point = { x, y, time }
      points.push(point)
      previous = point

      // Only the last few centimeters of mouse movement remain visible.
      let distance = 0
      for (let index = points.length - 1; index > 0; index -= 1) {
        distance += Math.hypot(
          points[index].x - points[index - 1].x,
          points[index].y - points[index - 1].y,
        )
        if (distance > maximumLength) {
          points.splice(0, index)
          break
        }
      }
      if (points.length > maximumPoints) points.splice(0, points.length - maximumPoints)
      if (!frame) frame = window.requestAnimationFrame(render)
    }

    const updatePreference = () => {
      active = finePointer.matches && !reducedMotion.matches
      canvas.hidden = !active
      if (!active) stop()
      else resize()
    }

    const onVisibility = () => {
      if (document.hidden) stop()
    }

    window.addEventListener('resize', resize, { passive: true })
    document.addEventListener('pointermove', onMove, { capture: true, passive: true })
    window.addEventListener('blur', stop)
    document.addEventListener('visibilitychange', onVisibility)
    finePointer.addEventListener('change', updatePreference)
    reducedMotion.addEventListener('change', updatePreference)
    updatePreference()

    return () => {
      window.removeEventListener('resize', resize)
      document.removeEventListener('pointermove', onMove, true)
      window.removeEventListener('blur', stop)
      document.removeEventListener('visibilitychange', onVisibility)
      finePointer.removeEventListener('change', updatePreference)
      reducedMotion.removeEventListener('change', updatePreference)
      stop()
    }
  }, [])

  return <canvas ref={canvasRef} className="cursor-brush-trail" aria-hidden="true" />
}
