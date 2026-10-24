import PageHero from '../components/PageHero.jsx'
import AboutSection from '../components/AboutSection.jsx'
import Features from '../components/Features.jsx'

export default function About() {
  return (
    <>
      <PageHero
        title="About Feane"
        subtitle="Good food, made with care."
        crumbs={[{ label: 'About' }]}
      />
      <section className="section">
        <AboutSection />
      </section>
      <section className="section section-alt">
        <Features />
      </section>
    </>
  )
}
