import PageHero from '../components/PageHero.jsx'
import BookTable from '../components/BookTable.jsx'

export default function Book() {
  return (
    <>
      <PageHero
        title="Book a Table"
        subtitle="Reserve your spot and we'll have it ready."
        crumbs={[{ label: 'Book Table' }]}
      />
      <section className="section section-tight">
        <BookTable />
      </section>
    </>
  )
}
