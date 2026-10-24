import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { calcTotals, lineTotal, money, unitPrice } from '../lib/pricing.js'
import { addOrder, clearCheckout, getCheckout } from '../lib/storage.js'
import { isPhone } from '../lib/validate.js'

const PAYMENTS = [
  { value: 'cod', label: 'Cash on delivery', icon: 'fa-money-bill-wave' },
  { value: 'card', label: 'Credit / debit card', icon: 'fa-credit-card' },
  { value: 'wallet', label: 'Online wallet', icon: 'fa-wallet' },
]

// What are we checking out? The "Order now" item(s), or – failing that – the whole cart.
function useCheckoutItems(cartItems) {
  const [saved] = useState(getCheckout)
  if (saved?.items?.length) return { items: saved.items, fromCart: Boolean(saved.fromCart) }
  return { items: cartItems, fromCart: true }
}

export default function Bill() {
  const toast = useToast()
  const { user } = useAuth()
  const { items: cartItems, clear: clearCart } = useCart()
  const { items, fromCart } = useCheckoutItems(cartItems)
  const totals = calcTotals(items)

  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '', payment: 'cod' })
  const [errors, setErrors] = useState({})
  const [placed, setPlaced] = useState(null)

  // prefill the name for signed-in customers
  useEffect(() => {
    const first = user?.user_metadata?.first_name
    if (first) setForm((f) => (f.name ? f : { ...f, name: first }))
  }, [user])

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }))
  }

  function handleConfirm(e) {
    e.preventDefault()
    const found = {}
    if (form.name.trim().length < 2) found.name = 'Please enter your full name'
    if (!isPhone(form.phone)) found.phone = 'Enter a valid phone number'
    if (form.address.trim().length < 5) found.address = 'Please enter your full delivery address'
    setErrors(found)
    if (Object.keys(found).length) return

    const order = {
      id: `FN-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString(),
      items,
      totals,
      customer: { name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim(), notes: form.notes.trim() },
      payment: form.payment,
    }
    addOrder(order)
    if (fromCart) clearCart()
    clearCheckout()
    setPlaced(order)
    toast.success('Order placed successfully!')
    window.scrollTo(0, 0)
  }

  // ---- success screen ----
  if (placed) {
    return (
      <>
        <PageHero title="Order confirmed" crumbs={[{ label: 'Checkout' }]} />
        <section className="section section-tight">
          <div className="container">
            <div className="state-card state-card-lg success">
              <i className="fa-solid fa-circle-check" />
              <h3>Thank you, {placed.customer.name}!</h3>
              <p>
                Your order <strong>{placed.id}</strong> has been placed and will be on its way soon.
                You'll pay <strong>{money(placed.totals.total)}</strong> ({PAYMENTS.find((p) => p.value === placed.payment)?.label.toLowerCase()}).
              </p>
              <div className="center-row">
                <Link to="/profile" className="pbtn pbtn-ghost">View my orders</Link>
                <Link to="/menu" className="pbtn pbtn-gold">Order something else</Link>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  // ---- nothing to check out ----
  if (items.length === 0) {
    return (
      <>
        <PageHero title="Checkout" crumbs={[{ label: 'Checkout' }]} />
        <section className="section section-tight">
          <div className="container">
            <div className="state-card state-card-lg">
              <i className="fa-solid fa-receipt" />
              <h3>No active order found</h3>
              <p>Please pick a dish first, then come back to check out.</p>
              <Link to="/menu" className="pbtn pbtn-gold">Browse the menu <i className="fa-solid fa-arrow-right" /></Link>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHero
        title="Checkout"
        subtitle="Review your items and complete your order."
        crumbs={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]}
      />

      <section className="section section-tight">
        <div className="container">
          <form className="checkout-layout" onSubmit={handleConfirm} noValidate>
            <div className="surface-card">
              <h3 className="card-title"><i className="fa-solid fa-truck-fast" /> Delivery information</h3>

              <div className="form-grid">
                <div className="field">
                  <label htmlFor="cust-name">Full name</label>
                  <input id="cust-name" className="input" type="text" placeholder="John Doe" value={form.name} onChange={set('name')} aria-invalid={Boolean(errors.name)} />
                  {errors.name && <small className="field-error">{errors.name}</small>}
                </div>
                <div className="field">
                  <label htmlFor="cust-phone">Phone number</label>
                  <input id="cust-phone" className="input" type="tel" placeholder="+92 300 1234567" value={form.phone} onChange={set('phone')} aria-invalid={Boolean(errors.phone)} />
                  {errors.phone && <small className="field-error">{errors.phone}</small>}
                </div>
                <div className="field full">
                  <label htmlFor="cust-address">Delivery address</label>
                  <textarea id="cust-address" className="input" rows="3" placeholder="Street, area, city…" value={form.address} onChange={set('address')} aria-invalid={Boolean(errors.address)} />
                  {errors.address && <small className="field-error">{errors.address}</small>}
                </div>
                <div className="field full">
                  <label htmlFor="cust-notes">Order notes <span className="optional">(optional)</span></label>
                  <input id="cust-notes" className="input" type="text" placeholder="e.g. ring the bell twice" value={form.notes} onChange={set('notes')} />
                </div>
              </div>

              <h3 className="card-title"><i className="fa-solid fa-wallet" /> Payment method</h3>
              <div className="pay-options">
                {PAYMENTS.map((p) => (
                  <label key={p.value} className={`option-card${form.payment === p.value ? ' selected' : ''}`}>
                    <input type="radio" name="payment" value={p.value} checked={form.payment === p.value} onChange={set('payment')} />
                    <i className={`fa-solid ${p.icon}`} />
                    <span className="option-name">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <aside className="summary-card">
              <h3>Order summary</h3>

              <div className="bill-items">
                {items.map((item, i) => (
                  <div className="bill-item" key={item.key || `${item.id}-${i}`}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <h4>{item.name}</h4>
                      <p>{item.option === 'Standard' ? 'Standard portion' : item.option}</p>
                      <p>Qty {item.quantity} × {money(unitPrice(item))}</p>
                    </div>
                    <strong>{money(lineTotal(item))}</strong>
                  </div>
                ))}
              </div>

              <div className="sum-row"><span>Subtotal</span><span>{money(totals.subtotal)}</span></div>
              <div className="sum-row"><span>Estimated tax (5%)</span><span>{money(totals.tax)}</span></div>
              <div className="sum-row"><span>Delivery fee</span><span>{money(totals.delivery)}</span></div>
              <div className="sum-total"><span>Total</span><span>{money(totals.total)}</span></div>

              <button type="submit" className="pbtn pbtn-gold pbtn-block">
                Confirm &amp; place order <i className="fa-solid fa-check" />
              </button>
              {fromCart && <Link to="/cart" className="link-muted center">← Edit cart</Link>}
            </aside>
          </form>
        </div>
      </section>
    </>
  )
}
