import aboutImg from '../assets/img/about-img.png'

export default function AboutSection() {
  return (
    <div className="part4">
      <div className="container">
        <div className="row about d-flex flex-column-reverse flex-md-row flex-lg-row">
          <div className="col-12 col-md-6">
            <img src={aboutImg} className="img-fluid" alt="" />
          </div>
          <div className="col-12 col-md-6 about_text">
            <h1>We Are Feane</h1>
            <p>
              There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All
            </p>
            <div className="col-6 col-md-4 text-center" id="butt2">Read More</div>
          </div>
        </div>
      </div>
    </div>
  )
}
