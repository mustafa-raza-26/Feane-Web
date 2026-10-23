import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes.js'
import RecipeCard from './RecipeCard.jsx'

const CATEGORIES = [
  { key: 'all', label: 'All', cols: 'col-3 col-md-2' },
  { key: 'chicken', label: 'Chicken', cols: 'col-4 col-md-2' },
  { key: 'pizza', label: 'Pizza', cols: 'col-4 col-md-2' },
  { key: 'pasta', label: 'Pasta', cols: 'col-4 col-md-2' },
  { key: 'cookies', label: 'Cookies', cols: 'col-4 col-md-2' },
]

/**
 * "Our Menu" block shared by the Home page and the Menu page.
 *  - limit: show only the first N items and a "View More" button (Home page)
 *  - description: small text under each dish name
 */
export default function MenuSection({ limit, description }) {
  const navigate = useNavigate()
  const { recipes, loading, error } = useRecipes()
  const [category, setCategory] = useState('all')

  const filtered =
    category === 'all'
      ? recipes
      : recipes.filter((r) => r.name.toLowerCase().includes(category))

  const visible = limit ? filtered.slice(0, limit) : filtered
  const showViewMore = Boolean(limit) && filtered.length > limit

  return (
    <div className="part3">
      <div className="container">
        <h1 className="text-center p-2">Our Menu</h1>

        <div className="food-type row fs-5 d-flex justify-content-around align-content-center text-center">
          {CATEGORIES.map((c) => (
            <div
              key={c.key}
              id={c.key}
              className={`${c.cols}${category === c.key ? ' active' : ''}`}
              onClick={() => setCategory(c.key)}
            >
              {c.label}
            </div>
          ))}
        </div>

        <div className="row pt-5 d-flex gap-2 justify-content-center justify-content-lg-around" id="display">
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {error && <p className="text-center text-danger">Could not load the menu: {error}</p>}
          {!loading && !error && visible.length === 0 && (
            <p className="text-center">No dishes found in this category.</p>
          )}
          {visible.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} description={description} />
          ))}
        </div>

        {showViewMore && (
          <div
            className="col-8 col-md-2 mx-auto text-center butt2"
            id="view_Btn"
            onClick={() => navigate('/menu')}
          >
            View More
          </div>
        )}
      </div>
    </div>
  )
}
