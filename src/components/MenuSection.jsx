import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes.js'
import { getPrice } from '../lib/pricing.js'
import RecipeCard from './RecipeCard.jsx'
import Reveal from './Reveal.jsx'

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'chicken', label: 'Chicken' },
  { key: 'pizza', label: 'Pizza' },
  { key: 'pasta', label: 'Pasta' },
  { key: 'cookies', label: 'Cookies' },
]

const SORTS = [
  { key: 'popular', label: 'Recommended' },
  { key: 'rating', label: 'Top rated' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
]

function sortRecipes(list, sort) {
  const copy = [...list]
  if (sort === 'rating') copy.sort((a, b) => b.rating - a.rating)
  if (sort === 'price-asc') copy.sort((a, b) => getPrice(a) - getPrice(b))
  if (sort === 'price-desc') copy.sort((a, b) => getPrice(b) - getPrice(a))
  return copy
}

/**
 * "Our Menu" block shared by the Home page and the Menu page.
 *  - limit: show only the first N dishes + a "View full menu" button (Home)
 *  - withTools: show the search box and sort dropdown (Menu page)
 */
export default function MenuSection({ limit, withTools = false }) {
  const { recipes, loading, error, retry } = useRecipes()
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('popular')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = recipes.filter((r) => {
      const inCategory = category === 'all' || r.name.toLowerCase().includes(category)
      const matches = !q || r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
      return inCategory && matches
    })
    return sortRecipes(list, sort)
  }, [recipes, category, query, sort])

  const visible = limit ? filtered.slice(0, limit) : filtered
  const hasMore = Boolean(limit) && filtered.length > limit

  return (
    <div className="menu-block">
      <div className="menu-toolbar">
        <div className="pill-tabs" role="tablist" aria-label="Dish categories">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              role="tab"
              aria-selected={category === c.key}
              className={`pill${category === c.key ? ' active' : ''}`}
              onClick={() => setCategory(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {withTools && (
          <div className="menu-tools">
            <label className="search">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                type="search"
                placeholder="Search dishes or cuisine…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search dishes"
              />
            </label>
            <select className="input select-sm" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort dishes">
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {withTools && !loading && !error && (
        <p className="result-count">{filtered.length} {filtered.length === 1 ? 'dish' : 'dishes'}</p>
      )}

      <div className="dish-grid">
        {loading &&
          Array.from({ length: limit || 8 }, (_, i) => (
            <div key={i} className="dish dish-skeleton" aria-hidden="true">
              <div className="skeleton sk-media" />
              <div className="dish-body">
                <div className="skeleton sk-line" />
                <div className="skeleton sk-line short" />
                <div className="skeleton sk-line" />
              </div>
            </div>
          ))}

        {visible.map((recipe, i) => (
          <Reveal key={recipe.id} delay={(i % 3) * 70}>
            <RecipeCard recipe={recipe} />
          </Reveal>
        ))}
      </div>

      {error && (
        <div className="state-card">
          <i className="fa-solid fa-triangle-exclamation" />
          <h3>Couldn't load the menu</h3>
          <p>{error}. Check your connection and try again.</p>
          <button type="button" className="pbtn pbtn-gold pbtn-sm" onClick={retry}>Try again</button>
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <div className="state-card">
          <i className="fa-solid fa-bowl-food" />
          <h3>No dishes found</h3>
          <p>Try a different category or search term.</p>
          <button
            type="button"
            className="pbtn pbtn-ghost pbtn-sm"
            onClick={() => {
              setCategory('all')
              setQuery('')
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {hasMore && (
        <div className="center-row">
          <Link to="/menu" className="pbtn pbtn-ghost">
            View full menu <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
      )}
    </div>
  )
}
