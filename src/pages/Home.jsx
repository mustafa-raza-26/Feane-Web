import HeroCarousel from '../components/HeroCarousel.jsx'
import MenuSection from '../components/MenuSection.jsx'
import AboutSection from '../components/AboutSection.jsx'
import BookTable from '../components/BookTable.jsx'
import Features from '../components/Features.jsx'
import Reveal from '../components/Reveal.jsx'
import { useOrderOnline } from '../hooks/useOrderOnline.js'
import offer1 from '../assets/img/o1.jpg'
import offer2 from '../assets/img/o2.jpg'

const OFFERS = [
  { title: 'Tasty Thursday', discount: '20%', note: 'Every Thursday on your favourites', image: offer1 },
  { title: 'Pizza Days', discount: '15%', note: 'Off every pizza on the menu', image: offer2 },
]

export default function Home() {
  const orderOnline = useOrderOnline()

  return (
    <>
      <section className="hero">
        <div className="container">
          <HeroCarousel />
          <ul className="hero-badges">
            <li><i className="fa-regular fa-clock" /> Open daily 9 AM – 1 PM</li>
            <li><i className="fa-solid fa-truck-fast" /> Fast delivery</li>
            <li><i className="fa-solid fa-hand-holding-dollar" /> Cash on delivery</li>
          </ul>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="offer-grid">
            {OFFERS.map((offer, i) => (
              <Reveal key={offer.title} className="offer-card" delay={i * 100}>
                <img src={offer.image} alt={offer.title} />
                <div>
                  <span className="eyebrow">Limited offer</span>
                  <h3>{offer.title}</h3>
                  <p className="offer-discount">{offer.discount} <small>Off</small></p>
                  <p className="offer-note">{offer.note}</p>
                  <button type="button" className="pbtn pbtn-gold pbtn-sm" onClick={orderOnline}>
                    Order now <i className="fa-solid fa-arrow-right" />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Our menu</span>
            <h2 className="section-title">Popular <em>dishes</em></h2>
            <p>Freshly prepared favourites, picked just for you.</p>
          </Reveal>
          <MenuSection limit={9} />
        </div>
      </section>

      <section className="section section-alt">
        <Features />
      </section>

      <section className="section">
        <AboutSection />
      </section>

      <section className="section section-alt" id="book">
        <BookTable />
      </section>
    </>
  )
}
