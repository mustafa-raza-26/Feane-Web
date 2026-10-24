import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import QtyStepper from '../components/QtyStepper.jsx'
import Stars from '../components/Stars.jsx'
import { useCart, cartKey } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { OPTIONS, getPrice, money, optionExtra } from '../lib/pricing.js'
import { setCheckout } from '../lib/storage.js'

const BASE_URL = 'https://dummyjson.com/recipes'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { addItem } = useCart()

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [option, setOption] = useState('Standard')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    setRecipe(null)
    setQuantity(1)
    setOption('Standard')

    fetch(`${BASE_URL}/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 404 ? 'This dish could not be found.' : 'Failed to load this dish.')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setRecipe(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const price = recipe ? getPrice(recipe) : 0
  const unit = price + optionExtra(option)
  const total = unit * quantity

  const buildItem = () => ({
    id: recipe.id,
    name: recipe.name,
    image: recipe.image,
    price,
    option,
    quantity,
    key: cartKey(recipe.id, option),
  })

  function handleAddToCart() {
    addItem({ id: recipe.id, name: recipe.name, image: recipe.image, price, option }, quantity)
    toast.success(`${quantity} × ${recipe.name} added to cart`)
  }

  function handleOrderNow() {
    setCheckout([buildItem()], false)
    navigate('/bill')
  }

  return (
    <>
      <PageHero
        title={recipe ? recipe.name : 'Dish details'}
        crumbs={[{ label: 'Menu', to: '/menu' }, { label: recipe ? recipe.name : 'Dish' }]}
      />

      <section className="section section-tight">
        <div className="container">
          {loading && (
            <div className="product-layout" aria-busy="true">
              <div className="skeleton sk-product-media" />
              <div>
                <div className="skeleton sk-line" />
                <div className="skeleton sk-line short" />
                <div className="skeleton sk-line" />
                <div className="skeleton sk-line short" />
              </div>
            </div>
          )}

          {error && (
            <div className="state-card state-card-lg">
              <i className="fa-solid fa-triangle-exclamation" />
              <h3>{error}</h3>
              <Link to="/menu" className="pbtn pbtn-gold">Back to menu</Link>
            </div>
          )}

          {recipe && (
            <>
              <div className="product-layout">
                <div className="product-media">
                  <img src={recipe.image} alt={recipe.name} />
                </div>

                <div className="product-info">
                  <span className="dish-tag static">{recipe.cuisine} cuisine</span>
                  <h2 className="product-title">{recipe.name}</h2>

                  <div className="product-rating">
                    <Stars value={recipe.rating} />
                    <strong>{recipe.rating}</strong>
                    <span>({recipe.reviewCount} reviews)</span>
                  </div>

                  <p className="product-price">{money(unit)} <small>per serving</small></p>

                  <ul className="chips">
                    <li><i className="fa-regular fa-clock" /> {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</li>
                    <li><i className="fa-solid fa-users" /> Serves {recipe.servings}</li>
                    <li><i className="fa-solid fa-fire-flame-curved" /> {recipe.caloriesPerServing} kcal</li>
                    <li><i className="fa-solid fa-gauge-simple" /> {recipe.difficulty}</li>
                  </ul>

                  <p className="product-desc">
                    A freshly prepared, authentic {recipe.cuisine} specialty featuring{' '}
                    {recipe.ingredients.slice(0, 3).join(', ')} and more. Made to order and ready in about{' '}
                    {recipe.prepTimeMinutes + recipe.cookTimeMinutes} minutes.
                  </p>

                  <fieldset className="option-group">
                    <legend>Choose your option</legend>
                    {OPTIONS.map((o) => (
                      <label key={o.value} className={`option-card${option === o.value ? ' selected' : ''}`}>
                        <input
                          type="radio"
                          name="food-option"
                          value={o.value}
                          checked={option === o.value}
                          onChange={() => setOption(o.value)}
                        />
                        <span className="option-name">{o.label}</span>
                        <span className="option-extra">{o.extra ? `+${money(o.extra)}` : 'Included'}</span>
                      </label>
                    ))}
                  </fieldset>

                  <div className="buy-row">
                    <QtyStepper value={quantity} onChange={setQuantity} />
                    <span className="buy-total">Total <strong>{money(total)}</strong></span>
                  </div>

                  <div className="buy-actions">
                    <button type="button" className="pbtn pbtn-ghost" onClick={handleAddToCart}>
                      <i className="fa-solid fa-bag-shopping" /> Add to cart
                    </button>
                    <button type="button" className="pbtn pbtn-gold" onClick={handleOrderNow}>
                      Order now <i className="fa-solid fa-arrow-right" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="detail-cards">
                <div className="detail-card">
                  <h3><i className="fa-solid fa-basket-shopping" /> Ingredients</h3>
                  <ul className="ingredient-list">
                    {recipe.ingredients.map((ing, i) => <li key={`${i}-${ing}`}>{ing}</li>)}
                  </ul>
                </div>
                <div className="detail-card">
                  <h3><i className="fa-solid fa-list-ol" /> How it's made</h3>
                  <ol className="step-list">
                    {recipe.instructions.map((step, i) => <li key={`${i}-${step.slice(0, 12)}`}>{step}</li>)}
                  </ol>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
