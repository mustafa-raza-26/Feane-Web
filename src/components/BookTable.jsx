export default function BookTable() {
  return (
    <div className="part5">
      <div className="container pt-5 pb-5">
        <div className="row pt-5 pb-3">
          <div className="col-12 col-md-6 tb">
            <h1>Book A Table</h1>

            <input className="col-12 col-md-12" type="text" placeholder="Your Name" />
            <input className="col-12 col-md-12" type="number" placeholder="Phone Number" />
            <input className="col-12 col-md-12" type="email" placeholder="Your Email" />
            <select className="col-12 col-md-12" defaultValue="" aria-label="How many persons?">
              <option value="" disabled>How Many Persons?</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <input className="col-12 col-md-12" type="date" aria-label="Date" />
            <div className="col-8 col-md-4 text-center readMore">View More</div>
          </div>

          <div className="col-12 col-md-6 map img-fluid">
            <iframe
              className="w-100"
              title="Restaurant location"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d83108.82463985033!2d67.043328!3d24.8643584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2s!4v1777389545365!5m2!1sen!2s"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
