import PageHero from '../components/PageHero.jsx'
import MenuSection from '../components/MenuSection.jsx'

export default function Menu() {
  return (
    <>
      <PageHero
        title="Our Menu"
        subtitle="Burgers, pizza, pasta and more — made fresh to order."
        crumbs={[{ label: 'Menu' }]}
      />
      <section className="section section-tight">
        <div className="container">
          <MenuSection withTools />
        </div>
      </section>
    </>
  )
}
