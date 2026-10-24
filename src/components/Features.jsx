import Reveal from './Reveal.jsx'

const FEATURES = [
  { icon: 'fa-leaf', title: 'Fresh ingredients', text: 'Prepared to order with quality ingredients, every single time.' },
  { icon: 'fa-bolt', title: 'Fast delivery', text: 'Hot food at your door, with a flat delivery fee and no surprises.' },
  { icon: 'fa-hand-holding-dollar', title: 'Cash on delivery', text: 'Pay when your food arrives — or choose card or wallet at checkout.' },
  { icon: 'fa-calendar-check', title: 'Easy table booking', text: 'Reserve a table in a few taps for your next family or friends night.' },
]

export default function Features() {
  return (
    <div className="container">
      <div className="feature-grid">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} className="feature" delay={i * 80}>
            <div className="feature-icon"><i className={`fa-solid ${f.icon}`} /></div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
