export const TAX_RATE = 0.05
export const DELIVERY_FEE = 3.5
export const EXTRA_COST = 3

export const OPTIONS = [
  { value: 'Standard', label: 'Standard portion', extra: 0 },
  { value: 'Extra Cheese', label: 'Extra cheese / topping', extra: EXTRA_COST },
]

export const money = (n) => `$${(Number(n) || 0).toFixed(2)}`

// The recipe API has no price, so one is derived from calories.
// Every page uses this same function (the old cards showed a fixed "$20").
export function getPrice(recipe) {
  const calories = Number(recipe?.caloriesPerServing)
  if (!calories) return 8
  return Math.round((calories / 35) * 100) / 100
}

export const optionExtra = (value) => OPTIONS.find((o) => o.value === value)?.extra ?? 0
export const unitPrice = (item) => (Number(item.price) || 0) + optionExtra(item.option)
export const lineTotal = (item) => unitPrice(item) * item.quantity

export function calcTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0)
  const tax = subtotal * TAX_RATE
  const delivery = items.length ? DELIVERY_FEE : 0
  return { subtotal, tax, delivery, total: subtotal + tax + delivery }
}
