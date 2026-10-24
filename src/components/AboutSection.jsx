import { Link } from 'react-router-dom'
import aboutImg from '../assets/img/about-img.png'
import Reveal from './Reveal.jsx'

export default function AboutSection() {
  return (
    <div className="container">
      <div className="about-grid">
        <Reveal className="about-media">
          <img src={aboutImg} alt="A freshly prepared Feane meal" />
        </Reveal>

        <Reveal className="about-text" delay={120}>
          <span className="eyebrow">Our story</span>
          <h2 className="section-title">We Are <em>Feane</em></h2>
          <p>
            Feane started with a simple idea: fast food should still be made with care. Every burger, pizza and
            bowl of pasta is prepared fresh when you order, using quality ingredients and recipes we are proud of.
          </p>
          <p>
            Whether you are dining in, booking a table for the family or ordering to your door, we want every
            meal to feel like a small celebration.
          </p>
          <ul className="check-list">
            <li><i className="fa-solid fa-circle-check" /> Made fresh, never reheated</li>
            <li><i className="fa-solid fa-circle-check" /> Order online in under a minute</li>
            <li><i className="fa-solid fa-circle-check" /> Cash on delivery available</li>
          </ul>
          <Link to="/menu" className="pbtn pbtn-gold">Explore the menu <i className="fa-solid fa-arrow-right" /></Link>
        </Reveal>
      </div>
    </div>
  )
}
