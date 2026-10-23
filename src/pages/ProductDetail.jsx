import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const BASE_URL = 'https://dummyjson.com/recipes'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

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

    fetch(`${BASE_URL}/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch recipe details')
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

  // The recipe API has no price, so (like before) it is derived from calories.
  const price = recipe ? parseFloat((recipe.caloriesPerServing / 35).toFixed(2)) : 0

  function buildItem() {
    return {
      id,
      name: recipe.name,
      price,
      image: recipe.image,
      quantity: Math.max(1, parseInt(quantity, 10) || 1),
      option,
    }
  }

  function handleOrder() {
    if (!recipe) return
    localStorage.setItem('orders', JSON.stringify(buildItem()))
    navigate('/bill')
  }

  function handleAddToCart() {
    if (!recipe) return
    localStorage.setItem('saveProduct', JSON.stringify(buildItem()))
    alert('Item added to cart successfully!')
  }

  return (
    <>
      <div className="part1" style={{ paddingBottom: 30 }}>
        <div className="container">
          <Navbar />
        </div>
      </div>

      <div className="part5" style={{ padding: '60px 0' }}>
        <div className="container" id="product-details-container">
          {loading && (
            <div className="text-center text-light py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading product details...</p>
            </div>
          )}

          {error && <div className="alert alert-warning text-center">{error}</div>}

          {recipe && (
            <div className="row align-items-center g-5">
              {/* Food image */}
              <div className="col-12 col-lg-6 text-center">
                <div
                  className="p-4 rounded-4"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                  }}
                >
                  <img
                    src={recipe.image}
                    className="img-fluid rounded-3"
                    alt={recipe.name}
                    style={{ maxHeight: 400, width: '100%', objectFit: 'contain', transition: 'transform 0.4s ease' }}
                  />
                </div>
              </div>

              {/* Details & ordering */}
              <div className="col-12 col-lg-6 tb">
                <span
                  className="badge mb-2 px-3 py-2"
                  style={{
                    background: 'rgba(243, 175, 61, 0.15)',
                    color: 'var(--gold-primary)',
                    fontWeight: 600,
                    borderRadius: 20,
                  }}
                >
                  {recipe.cuisine} Cuisine
                </span>

                <h1 style={{ fontSize: 45, marginBottom: 15 }}>{recipe.name}</h1>

                <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                  <h2 style={{ color: 'var(--gold-primary)', fontSize: 32, fontWeight: 700, margin: 0 }}>
                    ${price.toFixed(2)}
                  </h2>
                  <div className="text-warning fs-6">
                    <i className="fa-solid fa-star" />
                    <span className="text-light fw-bold ms-1">{recipe.rating}</span>
                    <span className="text-muted ms-2">({recipe.reviewCount} reviews)</span>
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 25 }}>
                  A freshly prepared, authentic {recipe.cuisine} specialty. Takes about{' '}
                  {recipe.prepTimeMinutes + recipe.cookTimeMinutes} minutes to craft and serves {recipe.servings}{' '}
                  people. Enjoy a delightful meal featuring {recipe.ingredients.slice(0, 3).join(', ')} and more!
                </p>

                <div className="mb-4">
                  <label className="form-label text-light fw-semibold mb-2" htmlFor="food-option">
                    Select Option
                  </label>
                  <select
                    id="food-option"
                    className="form-select bg-dark text-light border-secondary"
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                  >
                    <option value="Standard">Standard Portion ({recipe.caloriesPerServing} kcal)</option>
                    <option value="Extra Cheese">Extra Cheese / Topping +$3.00</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label text-light fw-semibold mb-2" htmlFor="food-quantity">
                    Quantity
                  </label>
                  <div className="d-flex align-items-center gap-3" style={{ maxWidth: 160 }}>
                    <input
                      type="number"
                      id="food-quantity"
                      className="form-control text-center fw-bold bg-dark text-light border-secondary"
                      value={quantity}
                      min="1"
                      max="10"
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="butt2 text-center text-white py-3 px-4 btn border-0 w-100"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 18 }}
                  >
                    Add To Cart
                  </button>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleOrder}
                    className="butt2 text-center text-white py-3 px-4 btn border-0 w-100"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 18 }}
                  >
                    <i className="fa-solid fa-bag-shopping me-2" /> Order Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
