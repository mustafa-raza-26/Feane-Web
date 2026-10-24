import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { KEYS, readJSON, writeJSON } from '../lib/storage.js'

const CartContext = createContext(null)
const MAX_QTY = 20

// Drop anything in storage that doesn't look like a cart line (hand-edited / old data).
function loadCart() {
  const saved = readJSON(KEYS.cart, [])
  if (!Array.isArray(saved)) return []
  return saved.filter(
    (i) => i && i.key && i.name && Number.isFinite(Number(i.price)) && Number(i.quantity) > 0,
  )
}

export const cartKey = (id, option) => `${id}:${option || 'Standard'}`

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    writeJSON(KEYS.cart, items)
  }, [items])

  // keep several open tabs in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEYS.cart) setItems(loadCart())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addItem = useCallback((item, quantity = 1) => {
    const option = item.option || 'Standard'
    const key = cartKey(item.id, option)
    setItems((prev) => {
      const found = prev.find((i) => i.key === key)
      if (found) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + quantity) } : i,
        )
      }
      return [...prev, { ...item, option, key, quantity: Math.min(MAX_QTY, quantity) }]
    })
  }, [])

  const setQuantity = useCallback((key, quantity) => {
    setItems((prev) =>
      prev.map((i) =>
        i.key === key ? { ...i, quantity: Math.max(1, Math.min(MAX_QTY, quantity)) } : i,
      ),
    )
  }, [])

  const removeItem = useCallback((key) => setItems((prev) => prev.filter((i) => i.key !== key)), [])
  const clear = useCallback(() => setItems([]), [])

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  const value = useMemo(
    () => ({ items, count, addItem, setQuantity, removeItem, clear }),
    [items, count, addItem, setQuantity, removeItem, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}

export { MAX_QTY }
