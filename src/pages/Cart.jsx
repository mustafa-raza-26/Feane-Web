import { Link, useNavigate } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import QtyStepper from '../components/QtyStepper.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { calcTotals, lineTotal, money, unitPrice } from '../lib/pricing.js'
import { setCheckout } from '../lib/storage.js'

export default function Cart() {
  const navigate = useNavigate()
  const toast = useToast()
  const { items, count, setQuantity, removeItem, clear } = useCart()
  const totals = calcTotals(items)

  function handleCheckout() {
    setCheckout(items, true)
    navigate('/bill')
  }

  function handleRemove(item) {
    removeItem(item.key)
    toast.info(`${item.name} removed`)
  }

  return (
    <>
      <PageHero
        title="Your Cart"
        subtitle={count ? `${count} ${count === 1 ? 'item' : 'items'} ready to order` : 'Nothing here yet'}
        crumbs={[{ label: 'Cart' }]}
      />

      <section className="section section-tight">
        <div className="container">
          {items.length === 0 ? (
            <div className="state-card state-card-lg">
              <i className="fa-solid fa-bag-shopping" />
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything yet. Explore the menu and find something tasty.</p>
              <Link to="/menu" className="pbtn pbtn-gold">Browse the menu <i className="fa-solid fa-arrow-right" /></Link>
            </div>
          ) : (
            <div className="checkout-layout">
              <div className="cart-list">
                {items.map((item) => (
                  <div className="cart-item" key={item.key}>
                    <Link to={`/product/${item.id}`} className="cart-thumb">
                      <img src={item.image} alt={item.name} />
                    </Link>

                    <div className="cart-info">
                      <h3><Link to={`/product/${item.id}`}>{item.name}</Link></h3>
                      <p className="cart-option">{item.option === 'Standard' ? 'Standard portion' : item.option}</p>
                      <p className="cart-unit">{money(unitPrice(item))} each</p>
                    </div>

                    <div className="cart-controls">
                      <QtyStepper value={item.quantity} onChange={(q) => setQuantity(item.key, q)} label={`Quantity of ${item.name}`} />
                      <strong className="cart-line">{money(lineTotal(item))}</strong>
                      <button type="button" className="cart-remove" onClick={() => handleRemove(item)} aria-label={`Remove ${item.name}`}>
                        <i className="fa-regular fa-trash-can" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="cart-actions">
                  <Link to="/menu" className="link-gold"><i className="fa-solid fa-arrow-left" /> Continue shopping</Link>
                  <button type="button" className="link-muted" onClick={clear}>Clear cart</button>
                </div>
              </div>

              <aside className="summary-card">
                <h3>Order summary</h3>
                <div className="sum-row"><span>Subtotal</span><span>{money(totals.subtotal)}</span></div>
                <div className="sum-row"><span>Estimated tax (5%)</span><span>{money(totals.tax)}</span></div>
                <div className="sum-row"><span>Delivery fee</span><span>{money(totals.delivery)}</span></div>
                <div className="sum-total"><span>Total</span><span>{money(totals.total)}</span></div>
                <button type="button" className="pbtn pbtn-gold pbtn-block" onClick={handleCheckout}>
                  Proceed to checkout <i className="fa-solid fa-arrow-right" />
                </button>
                <p className="summary-note"><i className="fa-solid fa-shield-halved" /> Cash on delivery available</p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
