import PageHeader from '../components/PageHeader.jsx'
import MenuSection from '../components/MenuSection.jsx'
import Footer from '../components/Footer.jsx'

export default function Menu() {
  return (
    <div className="menu-page">
      <PageHeader />
      <MenuSection description="Full menu item" />
      <Footer />
    </div>
  )
}
