import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { getPrice, money } from '../lib/pricing.js'

export default function RecipeCard({ recipe }) {
  const { addItem } = useCart()
  const toast = useToast()
  const price = getPrice(recipe)
  const minutes = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)

  function handleAdd() {
    addItem({ id: recipe.id, name: recipe.name, image: recipe.image, price, option: 'Standard' })
    toast.success(`${recipe.name} added to cart`)
  }

  return (
    <article className="dish">
      <Link to={`/product/${recipe.id}`} className="dish-media" aria-label={`View ${recipe.name}`}>
        <img src={recipe.image} alt={recipe.name} loading="lazy" />
        <span className="dish-rating"><i className="fa-solid fa-star" /> {recipe.rating}</span>
        <span className="dish-tag">{recipe.cuisine}</span>
      </Link>

      <div className="dish-body">
        <h3 className="dish-name">
          <Link to={`/product/${recipe.id}`}>{recipe.name}</Link>
        </h3>
        <ul className="dish-meta">
          <li><i className="fa-regular fa-clock" /> {minutes} min</li>
          <li><i className="fa-solid fa-fire-flame-curved" /> {recipe.caloriesPerServing} kcal</li>
          <li><i className="fa-solid fa-gauge-simple" /> {recipe.difficulty}</li>
        </ul>
        <div className="dish-foot">
          <span className="dish-price">{money(price)}</span>
          <button type="button" className="dish-add" onClick={handleAdd} aria-label={`Add ${recipe.name} to cart`}>
            <i className="fa-solid fa-plus" /> Add
          </button>
        </div>
      </div>
    </article>
  )
}
