import Navbar from './Navbar.jsx'

// Header band used by every inner page (menu, about, book, sign in, ...).
export default function PageHeader() {
  return (
    <div className="container-fluid menu-cont">
      <div className="container menu_nav">
        <Navbar />
      </div>
    </div>
  )
}
