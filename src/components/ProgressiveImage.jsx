import { useEffect, useRef, useState } from 'react'

/**
 * Keeps the real image in its fixed-size wrapper. If loading is slower than
 * 300 ms, reveal a quiet skeleton in precisely the same space.
 * The skeleton never appears on fast connections or from cache.
 */
export default function ProgressiveImage({
  src, fallbackSrc, alt = '', className = '', loading = 'lazy', ...props
}) {
  const imageRef = useRef(null)
  const [source, setSource] = useState(src)
  const [ready, setReady] = useState(false)
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    setSource(src)
    setReady(false)
    setSlow(false)
    const timer = window.setTimeout(() => {
      const element = imageRef.current
      if (element?.complete && element.naturalWidth > 0) setReady(true)
      else setSlow(true)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [src])

  const handleError = () => {
    if (fallbackSrc && source !== fallbackSrc) {
      setSource(fallbackSrc)
    } else {
      setReady(true)
      setSlow(false)
    }
  }

  const handleLoad = () => {
    setReady(true)
    setSlow(false)
  }

  return (
    <>
      <img
        ref={imageRef}
        {...props}
        src={source}
        alt={alt}
        className={`${className} progressive-image${ready ? ' is-ready' : ''}`}
        loading={loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
      />
      {slow && !ready && <span className="progressive-image-skeleton" aria-hidden="true" />}
    </>
  )
}
