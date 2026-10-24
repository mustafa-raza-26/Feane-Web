import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Carousel } from 'bootstrap'
import { useOrderOnline } from '../hooks/useOrderOnline.js'

const SLIDES = [
  {
    eyebrow: 'Fast Food Restaurant',
    title: ['Big flavour,', 'served fast'],
    text: 'Burgers, pizza, pasta and more — made fresh to order and delivered hot to your door.',
  },
  {
    eyebrow: 'Fresh every order',
    title: ['Crafted with', 'fresh ingredients'],
    text: 'Every dish is prepared when you order it. Never reheated, never rushed — just great taste.',
  },
  {
    eyebrow: 'Pizza · Burgers · Pasta',
    title: ['Your favourites,', 'one tap away'],
    text: 'Browse the full menu, add to cart and check out in under a minute. Cash on delivery available.',
  },
]

export default function HeroCarousel() {
  const ref = useRef(null)
  const [active, setActive] = useState(0)
  const orderOnline = useOrderOnline()

  useEffect(() => {
    const el = ref.current
    // Bootstrap's carousel: auto-slides every 4s, pauses on hover.
    const carousel = new Carousel(el, { interval: 4000, ride: 'carousel' })
    const onSlide = (e) => setActive(e.to)
    el.addEventListener('slide.bs.carousel', onSlide)
    return () => {
      el.removeEventListener('slide.bs.carousel', onSlide)
      carousel.dispose()
    }
  }, [])

  return (
    <div id="heroCarousel" className="carousel slide carousel-fade hero-carousel" ref={ref}>
      <div className="carousel-inner">
        {SLIDES.map((slide, i) => (
          <div key={slide.eyebrow} className={`carousel-item${i === 0 ? ' active' : ''}`}>
            <span className="eyebrow">{slide.eyebrow}</span>
            {i === 0 ? (
              <h1 className="hero-title">{slide.title[0]} <em>{slide.title[1]}</em></h1>
            ) : (
              <h2 className="hero-title">{slide.title[0]} <em>{slide.title[1]}</em></h2>
            )}
            <p className="hero-text">{slide.text}</p>
          </div>
        ))}
      </div>

      <div className="hero-actions">
        <button type="button" className="pbtn pbtn-gold" onClick={orderOnline}>
          Order Online <i className="fa-solid fa-arrow-right" />
        </button>
        <Link to="/menu" className="pbtn pbtn-ghost">View Menu</Link>
      </div>

      <div className="hero-dots">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.eyebrow}
            type="button"
            className={active === i ? 'active' : ''}
            data-bs-target="#heroCarousel"
            data-bs-slide-to={i}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
