import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'

// Bootstrap modal markup/classes, driven by React state instead of data attributes.
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
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="loginModalTitle"
        onClick={onClose}
      >
        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalTitle">Login Required</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>

            <div className="modal-body text-center">
              <Link to="/signin" className="btn btn-primary me-2">Login</Link>
              <Link to="/signup" className="btn btn-success">Signup</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>,
    document.body,
  )
}
