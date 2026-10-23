import Navbar from '../components/Navbar.jsx'
import HeroCarousel from '../components/HeroCarousel.jsx'
import MenuSection from '../components/MenuSection.jsx'
import AboutSection from '../components/AboutSection.jsx'
import BookTable from '../components/BookTable.jsx'
import Footer from '../components/Footer.jsx'
import offer1 from '../assets/img/o1.jpg'
import offer2 from '../assets/img/o2.jpg'

const OFFERS = [
  { title: 'Tasty Thursday', discount: '20%', image: offer1 },
  { title: 'Pizza Days', discount: '15%', image: offer2 },
]

export default function Home() {
  return (
    <>
      <div className="part1">
        <div className="container">
          <Navbar />
          <HeroCarousel />
        </div>
      </div>

      <div className="part2">
        <div className="container">
          <div className="row cd p-2 justify-content-center gap-4 gap-md-2 gap-lg-4">
            {OFFERS.map((offer) => (
              <div key={offer.title} className="c1 col-12 col-md-6 col-lg-5 p-4">
                <div className="row text-center align-items-center">
                  <div className="left col-12 col-md-6">
                    <img src={offer.image} className="img-fluid" alt={offer.title} />
                  </div>
                  <div className="right col-12 col-md-6">
                    <h2>{offer.title}</h2>
                    <h3><span>{offer.discount} <sub>Off</sub></span></h3>
                    <div className="butt2 col-9 mx-auto text-center">
                      Order Now <i className="fa-solid fa-cart-shopping" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MenuSection
        limit={9}
        description="Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque"
      />

      <AboutSection />
      <BookTable />
      <Footer />
    </>
  )
}
