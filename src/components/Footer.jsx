export default function Footer() {
  return (
    <div className="footer">
      <div className="container pt-4 pb-2">
        <div className="row pt-4 pb-2">
          <div className="row col-12 col-md-12 d-flex text-center justify-content-around">
            <div className="col-12 col-md-4 contact">
              <h2>Contact Us</h2><br />
              <p><span><i className="fa-solid fa-location-dot" /> location</span></p>
              <p><span><i className="fa-solid fa-phone" /> Call +0123456789</span></p>
              <p><span><i className="fa-solid fa-envelope" /> mr@gmail.com</span></p>
            </div>
            <div className="col-12 col-md-4">
              <h1>Feane</h1>
              <p>Necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with</p>
              <p className="d-flex justify-content-center icon-down">
                <i className="fa-brands fa-facebook-f face" />
                <i className="fa-brands fa-twitter face" />
                <i className="fa-brands fa-linkedin-in face" />
                <i className="fa-brands fa-instagram face" />
              </p>
            </div>
            <div className="col-12 col-md-4">
              <h2>Opening Hours</h2><br />
              <p>Everyday</p>
              <p>9:00 Am to 1:00 Pm</p>
            </div>
          </div>

          <div className="col-12 text-center pt-4 pb-4 ps-2 pe-2">
            © 2026 All Rights Reserved By Mustafa Raza
          </div>
        </div>
      </div>
    </div>
  )
}
