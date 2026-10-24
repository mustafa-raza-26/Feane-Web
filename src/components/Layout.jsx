import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

export default function Layout() {
  const { pathname } = useLocation()
  return (
    <>
      <Navbar />
      {/* key restarts the fade-in animation on every page change */}
      <main className="page" key={pathname}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
