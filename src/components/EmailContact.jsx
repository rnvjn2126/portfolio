import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, Mail, X } from 'lucide-react'
import { site } from '../data/site'

const EmailContext = createContext(null)

export function EmailContactProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const previousFocus = useRef(null)
  const copyButton = useRef(null)

  const close = useCallback(() => setIsOpen(false), [])
  const show = useCallback(() => {
    previousFocus.current = document.activeElement
    setCopied(false)
    setError('')
    setIsOpen(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    copyButton.current?.focus()
    const onKeyDown = event => {
      if (event.key === 'Escape') close()
      if (event.key === 'Tab') {
        const dialog = document.querySelector('[data-email-dialog]')
        const buttons = [...(dialog?.querySelectorAll('button') || [])].filter(item => !item.disabled)
        if (!buttons.length) return
        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      previousFocus.current?.focus?.()
    }
  }, [isOpen, close])

  async function copyEmail() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(site.email)
      } else {
        const input = document.createElement('textarea')
        input.value = site.email
        input.style.position = 'fixed'
        input.style.opacity = '0'
        document.body.appendChild(input)
        input.select()
        const success = document.execCommand('copy')
        input.remove()
        if (!success) throw new Error('Copy failed')
      }
      setCopied(true)
      setError('')
    } catch {
      setCopied(false)
      setError('Copy was blocked by your browser. Select the address above to copy it manually.')
    }
  }

  function openEmailApp() {
    window.location.href = 'mailto:' + site.email
    close()
  }

  return (
    <EmailContext.Provider value={show}>
      {children}
      {isOpen && (
        <div
          className="email-choice-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) close()
          }}
        >
          <section
            className="email-choice-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="email-choice-heading"
            aria-describedby="email-choice-description"
            data-email-dialog
          >
            <button className="email-choice-close" type="button" onClick={close} aria-label="Close email options">
              <X size={19} aria-hidden="true" />
            </button>
            <span className="email-choice-kicker"><span aria-hidden="true" /> GET IN TOUCH</span>
            <h2 id="email-choice-heading">Let's start a conversation.</h2>
            <p id="email-choice-description">Choose how you'd like to reach me.</p>
            <div className="email-choice-address">
              <Mail size={19} aria-hidden="true" />
              <span>{site.email}</span>
            </div>
            <div className="email-choice-actions">
              <button ref={copyButton} className="email-choice-copy" type="button" onClick={copyEmail}>
                {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
                <span>{copied ? 'Email copied' : 'Copy email address'}</span>
              </button>
              <button className="email-choice-open" type="button" onClick={openEmailApp}>
                <Mail size={18} aria-hidden="true" />
                <span>Open email app</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </button>
            </div>
            <p className="email-choice-feedback" role="status" aria-live="polite">
              {error || (copied ? 'Copied to your clipboard. You can paste it anywhere.' : '')}
            </p>
          </section>
        </div>
      )}
    </EmailContext.Provider>
  )
}

export function EmailTrigger({ children, className = '', onClick, ...props }) {
  const show = useContext(EmailContext)
  if (!show) throw new Error('EmailTrigger requires EmailContactProvider')
  return (
    <button
      {...props}
      className={className}
      type="button"
      onClick={event => {
        onClick?.(event)
        if (!event.defaultPrevented) show()
      }}
    >
      {children}
    </button>
  )
}
