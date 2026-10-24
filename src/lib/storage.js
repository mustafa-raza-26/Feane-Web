// Small, safe wrappers around localStorage (it can throw in private mode / blocked storage).
export const KEYS = {
  cart: 'feane_cart',
  checkout: 'feane_checkout',
  orders: 'feane_orders',
  reservations: 'feane_reservations',
}

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable – ignore */
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

// ---- checkout hand-off (product page / cart  ->  bill page) ----
export const setCheckout = (items, fromCart) => writeJSON(KEYS.checkout, { items, fromCart })
export const getCheckout = () => readJSON(KEYS.checkout, null)
export const clearCheckout = () => removeKey(KEYS.checkout)

// ---- order + reservation history (shown on the profile page) ----
export const getOrders = () => readJSON(KEYS.orders, [])
export const addOrder = (order) => writeJSON(KEYS.orders, [order, ...getOrders()])
export const getReservations = () => readJSON(KEYS.reservations, [])
export const addReservation = (r) => writeJSON(KEYS.reservations, [r, ...getReservations()])
