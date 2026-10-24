import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="brand" to="/">Feane<span>.</span></Link>
            <p>
              Fresh burgers, pizza, pasta and more — made to order and delivered hot, every day.
            </p>
            <div className="socials">
              <a href="#" aria-label="Facebook" onClick={(e) => e.preventDefault()}><i className="fa-brands fa-facebook-f" /></a>
              <a href="#" aria-label="Twitter" onClick={(e) => e.preventDefault()}><i className="fa-brands fa-twitter" /></a>
              <a href="#" aria-label="LinkedIn" onClick={(e) => e.preventDefault()}><i className="fa-brands fa-linkedin-in" /></a>
              <a href="#" aria-label="Instagram" onClick={(e) => e.preventDefault()}><i className="fa-brands fa-instagram" /></a>
            </div>
          </div>

          <div>
            <h4>Explore</h4>
            <ul className="footer-links">
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/book">Book a table</Link></li>
              <li><Link to="/cart">Your cart</Link></li>
              <li><Link to="/profile">My profile</Link></li>
            </ul>
          </div>

          <div className="contact">
            <h4>Contact us</h4>
            <p><i className="fa-solid fa-location-dot" /> Karachi, Pakistan</p>
            <p><i className="fa-solid fa-phone" /> +0123456789</p>
            <p><i className="fa-solid fa-envelope" /> mr@gmail.com</p>
          </div>

          <div>
            <h4>Opening hours</h4>
            <p><i className="fa-regular fa-clock" /> Everyday</p>
            <p className="gold-text">9:00 AM – 1:00 PM</p>
          </div>
        </div>

        <div className="footer-bottom">© 2026 All Rights Reserved By Mustafa Raza</div>
      </div>
    </footer>
  )
}
