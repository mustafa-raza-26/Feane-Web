import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'

// "Please sign in" prompt, shown when a guest tries to order.
export default function LoginModal({ show, onClose }) {
  useEffect(() => {
    if (!show) return undefined
    document.body.classList.add('modal-open')
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [show, onClose])

  if (!show) return null

  return createPortal(
    <div className="px-backdrop" onClick={onClose}>
      <div
        className="px-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="loginModalTitle"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="px-modal-close" aria-label="Close" onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </button>
        <div className="px-modal-icon"><i className="fa-solid fa-lock" /></div>
        <h3 id="loginModalTitle">Sign in to order</h3>
        <p>Create a free account or log in to start ordering your favourite dishes.</p>
        <div className="px-modal-actions">
          <Link to="/signin" className="pbtn pbtn-gold" onClick={onClose}>Login</Link>
          <Link to="/signup" className="pbtn pbtn-ghost" onClick={onClose}>Sign up</Link>
        </div>
      </div>
    </div>,
    document.body,
  )
}
