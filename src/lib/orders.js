import { client } from './supabase.js'
import { lineTotal, unitPrice } from './pricing.js'

// Save a placed order in the Supabase "addToCart" table.
//
//  id / created_at ........ filled by Supabase
//  userId ................. signed-in user's id (null for guests)
//  Name / contctNo ........ customer details
//  deliveryAddress ........ delivery address
//  orderNote .............. optional note
//  orderStatus ............ starts as "pending"
//  orderItem (json) ....... the whole order summary: items, totals AND payment method
export async function saveOrder(order, user) {
  if (!client) return { skipped: true, error: null }

  // contctNo is a numeric column, so keep digits only ("+92 300 1234567" -> 923001234567)
  const digits = order.customer.phone.replace(/\D/g, '')

  const row = {
    userId: user?.id ?? null,
    Name: order.customer.name,
    contctNo: digits ? Number(digits) : null,
    deliveryAddress: order.customer.address,
    orderNote: order.customer.notes || null,
    orderStatus: 'pending',
    orderItem: {
      orderId: order.id,
      placedAt: order.date,
      paymentMethod: order.payment, // cod | card | wallet
      items: order.items.map((i) => ({
        id: i.id,
        name: i.name,
        option: i.option,
        quantity: i.quantity,
        unitPrice: Number(unitPrice(i).toFixed(2)),
        lineTotal: Number(lineTotal(i).toFixed(2)),
      })),
      totals: {
        subtotal: Number(order.totals.subtotal.toFixed(2)),
        tax: Number(order.totals.tax.toFixed(2)),
        delivery: Number(order.totals.delivery.toFixed(2)),
        total: Number(order.totals.total.toFixed(2)),
      },
    },
  }

  const { error } = await client.from('addToCart').insert(row)
  return { skipped: false, error }
}
