import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useOrderOnline } from '../hooks/useOrderOnline.js'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About' },
  { to: '/book', label: 'Book Table' },
]

export default function Navbar() {
  const { count } = useCart()
  const { user } = useAuth()
  const orderOnline = useOrderOnline()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // close the mobile menu after navigating
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const initial = (user?.user_metadata?.first_name || user?.email || '').charAt(0).toUpperCase()

  return (
    <header className={`site-nav${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <div className="bar">
          <Link className="brand" to="/" aria-label="Feane home">
            Feane<span>.</span>
          </Link>

          <div className={`nav-panel${open ? ' open' : ''}`} id="nav-panel">
            <ul className="nav-links">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.end}>{l.label}</NavLink>
                </li>
              ))}
            </ul>
            <button type="button" className="pbtn pbtn-gold pbtn-sm" onClick={orderOnline}>
              Order Online <i className="fa-solid fa-arrow-right" />
            </button>
          </div>

          <div className="nav-actions">
            <Link to="/cart" className="icon-btn" aria-label={`Cart, ${count} items`}>
              <i className="fa-solid fa-bag-shopping" />
              {count > 0 && <span className="cart-badge">{count > 99 ? '99+' : count}</span>}
            </Link>
            <Link to="/profile" className="icon-btn" aria-label="Profile">
              {user ? <span className="nav-initial">{initial}</span> : <i className="fa-regular fa-user" />}
            </Link>
            <button
              type="button"
              className="icon-btn nav-toggle"
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="nav-panel"
              onClick={() => setOpen((o) => !o)}
            >
              <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
