import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TAX_RATE = 0.05
const DELIVERY_FEE = 3.5
const EXTRA_CHEESE_COST = 3.0
const GOLD = 'var(--gold-primary, #f3af3d)'

// The order is saved by the product page in localStorage under "orders".
function readOrder() {
  try {
    const saved = localStorage.getItem('orders')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

const money = (n) => `$${n.toFixed(2)}`

export default function Bill() {
  const navigate = useNavigate()
  const [order] = useState(readOrder)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  let unitPrice = 0
  let subtotal = 0
  let tax = 0
  let total = 0

  if (order) {
    const basePrice = parseFloat(order.price) || 0
    const extraCost = order.option && order.option.includes('Extra Cheese') ? EXTRA_CHEESE_COST : 0
    unitPrice = basePrice + extraCost
    subtotal = unitPrice * order.quantity
    tax = subtotal * TAX_RATE
    total = subtotal + tax + DELIVERY_FEE
  }

  function handleConfirm() {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill in all delivery details before confirming your order.')
      return
    }
    alert(`Thank you, ${name.trim()}! Your order for ${order.name} has been successfully placed and will be delivered soon.`)
    localStorage.removeItem('orders')
    navigate('/')
  }

  return (
    <div className="bill-page bg-dark text-light min-vh-100">
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold" style={{ color: GOLD }}>Order Invoice</h1>
          <p className="text-muted">Review your items and complete your secure checkout</p>
        </div>

        <div className="row g-5">
          {/* Billing details / customer form */}
          <div className="col-lg-7">
            <div className="card p-4 rounded-4 shadow-lg border-secondary bg-black">
              <h4 className="mb-4 text-light"><i className="fa-solid fa-user-shield me-2" />Delivery Information</h4>
              <form id="checkout-form" onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                  <label className="form-label text-muted" htmlFor="cust-name">Full Name</label>
                  <input
                    type="text"
                    id="cust-name"
                    className="form-control bg-dark text-light border-secondary"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted" htmlFor="cust-phone">Phone Number</label>
                  <input
                    type="tel"
                    id="cust-phone"
                    className="form-control bg-dark text-light border-secondary"
                    placeholder="+1 (234) 567-890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted" htmlFor="cust-address">Delivery Address</label>
                  <textarea
                    id="cust-address"
                    className="form-control bg-dark text-light border-secondary"
                    rows="3"
                    placeholder="Street, City, Apartment, etc."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted" htmlFor="cust-payment">Payment Method</label>
                  <select id="cust-payment" className="form-select bg-dark text-light border-secondary" defaultValue="cod">
                    <option value="cod">Cash on Delivery (COD)</option>
                    <option value="card">Credit / Debit Card</option>
                    <option value="wallet">Online Wallet</option>
                  </select>
                </div>
              </form>
            </div>
          </div>

          {/* Order summary / bill receipt */}
          <div className="col-lg-5">
            <div className="card p-4 rounded-4 shadow-lg border-secondary bg-black">
              <h4 className="mb-4 text-light"><i className="fa-solid fa-receipt me-2" />Order Summary</h4>

              <div id="bill-items-container" className="border-bottom border-secondary pb-3 mb-3">
                {order ? (
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={order.image}
                      alt={order.name}
                      className="rounded-3"
                      style={{ width: 60, height: 60, objectFit: 'contain', background: '#1a1a1a' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1 text-light fw-bold">{order.name}</h6>
                      <small className="text-muted d-block">Option: {order.option}</small>
                      <small className="text-muted">Qty: {order.quantity} × {money(unitPrice)}</small>
                    </div>
                    <span className="fw-bold text-light">{money(subtotal)}</span>
                  </div>
                ) : (
                  <p className="text-muted text-center mb-0">
                    No active order found. Please select a recipe first.
                  </p>
                )}
              </div>

              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>Subtotal</span>
                <span id="bill-subtotal">{money(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>Estimated Tax (5%)</span>
                <span id="bill-tax">{money(tax)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Delivery Fee</span>
                <span id="bill-delivery">{money(DELIVERY_FEE)}</span>
              </div>

              <hr className="border-secondary" />

              <div className="d-flex justify-content-between mb-4 fs-5 fw-bold">
                <span>Total Amount</span>
                <span id="bill-total" style={{ color: GOLD }}>{money(total)}</span>
              </div>

              <button
                type="button"
                id="confirm-order-btn"
                className="btn w-100 py-3 fw-bold text-dark"
                style={{ background: GOLD, border: 'none', cursor: 'pointer' }}
                onClick={handleConfirm}
                disabled={!order}
              >
                Confirm &amp; Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
