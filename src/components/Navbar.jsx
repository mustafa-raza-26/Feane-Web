import { useCallback, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { client } from '../lib/supabase.js'
import LoginModal from './LoginModal.jsx'

export default function Navbar() {
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const closeLogin = useCallback(() => setShowLogin(false), [])

  // "Order Online": go to the menu if signed in, otherwise ask the user to log in.
  async function handleOrderOnline(e) {
    e.preventDefault()
    if (!client) {
      setShowLogin(true)
      return
    }
    const { data } = await client.auth.getSession()
    if (data.session) {
      navigate('/menu')
    } else {
      setShowLogin(true)
    }
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg pt-0 pb-0">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <h1 style={{ color: '#ffffff' }}>Feane</h1>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target=".navbar-collapse"
            aria-controls="navbarNav navbarIcons"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <abbr title="Home"><NavLink className="nav-link" to="/" end>Home</NavLink></abbr>
              </li>
              <li className="nav-item">
                <abbr title="Menu"><NavLink className="nav-link" to="/menu">Menu</NavLink></abbr>
              </li>
              <li className="nav-item">
                <abbr title="About"><NavLink className="nav-link" to="/about">About</NavLink></abbr>
              </li>
              <li className="nav-item">
                <abbr title="BookTable"><NavLink className="nav-link" to="/book">BookTable</NavLink></abbr>
              </li>
            </ul>
          </div>

          <div className="collapse navbar-collapse justify-content-end" id="navbarIcons">
            <ul className="navbar-nav">
              <li className="nav-item icon">
                <NavLink className="nav-link" to="/profile" aria-label="Profile">
                  <i className="fa-solid fa-user" />
                </NavLink>
              </li>
              <li className="nav-item icon">
                <Link className="nav-link" to="/" aria-label="Cart">
                  <i className="fa-solid fa-cart-shopping" />
                </Link>
              </li>
              <li className="nav-item butt">
                <a className="nav-link order" href="/menu" onClick={handleOrderOnline}>Order Online</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <LoginModal show={showLogin} onClose={closeLogin} />
    </>
  )
}
