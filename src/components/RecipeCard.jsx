import { Link } from 'react-router-dom'

export default function RecipeCard({ recipe, description }) {
  return (
    <div className="crd p-0 col-11 col-md-3">
      <div className="image">
        <img src={recipe.image} alt={recipe.name} />
      </div>
      <div className="cd-content curve">
        <h5>{recipe.name}</h5>
        <p>{description}</p>
        <div className="d-flex justify-content-between pt-2">
          <div>$20</div>
          <Link className="card_Btn" to={`/product/${recipe.id}`} aria-label={`View ${recipe.name}`}>
            <i className="fa-solid fa-cart-shopping cart" />
          </Link>
        </div>
      </div>
    </div>
  )
}
