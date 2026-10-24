import { Link } from 'react-router-dom'

// Banner at the top of inner pages: title + breadcrumb.
export default function PageHero({ title, subtitle, crumbs = [] }) {
  return (
    <section className="page-hero">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label}>
              <i className="fa-solid fa-chevron-right" />
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span className="current">{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  )
}
