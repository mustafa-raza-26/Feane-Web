import { useEffect, useRef, useState } from 'react'
import { Carousel } from 'bootstrap'

const SLIDES = [0, 1, 2].map((i) => ({
  id: i,
  title: 'Fast Food Restaurant',
  text: 'Doloremque, itaque aperiam facilis rerum, commodi, temporibus sapiente ad mollitia laborum quam quisquam esse error unde. Tempora ex doloremque, labore, sunt repellat dolore, iste magni quos nihil ducimus libero ipsam.',
}))

export default function HeroCarousel() {
  const ref = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = ref.current
    // Bootstrap's own carousel (auto-slides every 2s), same options as the old data-bs-* attributes.
    const carousel = new Carousel(el, { interval: 2000, ride: 'carousel' })
    // Keep our custom indicator dots in sync with the slide.
    const onSlide = (e) => setActive(e.to)
    el.addEventListener('slide.bs.carousel', onSlide)
    return () => {
      el.removeEventListener('slide.bs.carousel', onSlide)
      carousel.dispose()
    }
  }, [])

  return (
    <div id="customCarousel" className="carousel slide" ref={ref}>
      <div className="carousel-inner">
        {SLIDES.map((slide, i) => (
          <div key={slide.id} className={`carousel-item${i === 0 ? ' active' : ''}`}>
            <div className="head col-12 col-md-6"><h1>{slide.title}</h1></div>
            <div className="text col-12 col-md-7"><p>{slide.text}</p></div>
            <div className="butt2 col col-7 col-md-3 col-lg-2 text-center">Order Online</div>
          </div>
        ))}
      </div>

      {/* Custom indicator buttons */}
      <div className="custom-controls">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            className={`custom-btn${active === i ? ' active' : ''}`}
            data-bs-target="#customCarousel"
            data-bs-slide-to={i}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
