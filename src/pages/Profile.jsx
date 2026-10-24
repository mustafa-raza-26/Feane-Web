import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { client, SUPABASE_NOT_CONFIGURED_MESSAGE } from '../lib/supabase.js'
import { money } from '../lib/pricing.js'
import { getOrders, getReservations } from '../lib/storage.js'
import { isPhone } from '../lib/validate.js'

// "09:30" -> "9:30 AM" (bookings are saved as 24h slots)
const fmtTime = (t) => {
  const [h, m] = String(t).split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return t
  return `${h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

export default function Profile() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, loading, signOut } = useAuth()
  const { count } = useCart()

  const [row, setRow] = useState(null) // the user's row in the user_food table
  const [rowError, setRowError] = useState('')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', number: '', address: '' })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [tab, setTab] = useState('orders')

  const [orders] = useState(getOrders)
  const [reservations] = useState(getReservations)

  // load the profile row for the signed-in user
  useEffect(() => {
    if (!client || !user) return undefined
    let cancelled = false
    client
      .from('user_food')
      .select('firstName, lastName, email, number, address')
      .eq('uid', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) setRowError(error.message)
        else setRow(data?.[0] ?? null)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  // ---- states without a signed-in user ----
  if (loading) {
    return (
      <>
        <PageHero title="My Profile" crumbs={[{ label: 'Profile' }]} />
        <section className="section section-tight">
          <div className="container"><div className="skeleton sk-profile" /></div>
        </section>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <PageHero title="My Profile" crumbs={[{ label: 'Profile' }]} />
        <section className="section section-tight">
          <div className="container">
            <div className="state-card state-card-lg">
              <i className="fa-regular fa-user" />
              <h3>You are not signed in</h3>
              <p>{client ? 'Sign in to see your profile, orders and bookings.' : SUPABASE_NOT_CONFIGURED_MESSAGE}</p>
              <div className="center-row">
                <Link to="/signin" className="pbtn pbtn-gold">Sign in</Link>
                <Link to="/signup" className="pbtn pbtn-ghost">Create account</Link>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  // ---- signed in ----
  const firstName = row?.firstName || user.user_metadata?.first_name || ''
  const lastName = row?.lastName || ''
  const displayName = `${firstName} ${lastName}`.trim() || user.email
  const initial = displayName.charAt(0).toUpperCase()
  const memberSince = user.created_at ? fmtDate(user.created_at) : '—'

  function startEdit() {
    setForm({
      firstName: row?.firstName || user.user_metadata?.first_name || '',
      lastName: row?.lastName || '',
      number: row?.number || '',
      address: row?.address || '',
    })
    setFormError('')
    setEditing(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setFormError('')
    if (form.firstName.trim().length < 2) return setFormError('Please enter your first name.')
    if (form.number && !isPhone(form.number)) return setFormError('Please enter a valid phone number.')

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      number: form.number,
      address: form.address.trim(),
    }

    setSaving(true)
    let result = await client.from('user_food').update(payload).eq('uid', user.id).select()
    // no row yet (e.g. sign-up needed email confirmation) -> create it
    if (!result.error && (!result.data || result.data.length === 0)) {
      result = await client.from('user_food').insert({ uid: user.id, email: user.email, ...payload }).select()
    }
    setSaving(false)

    if (result.error) return setFormError(result.error.message)
    setRow({ email: user.email, ...row, ...payload })
    setEditing(false)
    toast.success('Profile updated')
    return undefined
  }

  async function handleLogout() {
    const { error } = await signOut()
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <>
      <PageHero title="My Profile" crumbs={[{ label: 'Profile' }]} />

      <section className="section section-tight">
        <div className="container">
          {/* header card */}
          <div className="profile-head">
            <div className="avatar" aria-hidden="true">{initial}</div>
            <div className="profile-id">
              <h2>{displayName}</h2>
              <p>{user.email}</p>
              <span className="member">Member since {memberSince}</span>
            </div>
            <button type="button" className="pbtn pbtn-ghost pbtn-sm" onClick={handleLogout} id="logout">
              <i className="fa-solid fa-right-from-bracket" /> Log out
            </button>
          </div>

          {/* stats */}
          <div className="stat-tiles">
            <div className="stat"><strong>{orders.length}</strong><span>Orders placed</span></div>
            <div className="stat"><strong>{count}</strong><span>Items in cart</span></div>
            <div className="stat"><strong>{reservations.length}</strong><span>Table bookings</span></div>
          </div>

          <div className="profile-grid">
            {/* account details */}
            <div className="surface-card">
              <div className="card-head">
                <h3 className="card-title"><i className="fa-regular fa-id-card" /> Account details</h3>
                {!editing && (
                  <button type="button" className="link-gold" onClick={startEdit}>
                    <i className="fa-solid fa-pen" /> Edit
                  </button>
                )}
              </div>

              {rowError && <div className="form-alert" role="alert"><i className="fa-solid fa-circle-exclamation" /> {rowError}</div>}

              {editing ? (
                <form onSubmit={handleSave} noValidate>
                  <div className="form-grid">
                    <div className="field">
                      <label htmlFor="pf-first">First name</label>
                      <input id="pf-first" className="input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                    </div>
                    <div className="field">
                      <label htmlFor="pf-last">Last name</label>
                      <input id="pf-last" className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                    </div>
                    <div className="field full">
                      <label htmlFor="pf-phone">Phone</label>
                      <input id="pf-phone" className="input" type="tel" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
                    </div>
                    <div className="field full">
                      <label htmlFor="pf-address">Address</label>
                      <input id="pf-address" className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                    </div>
                  </div>
                  {formError && <div className="form-alert" role="alert"><i className="fa-solid fa-circle-exclamation" /> {formError}</div>}
                  <div className="form-actions">
                    <button type="submit" className="pbtn pbtn-gold pbtn-sm" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
                    <button type="button" className="pbtn pbtn-ghost pbtn-sm" onClick={() => setEditing(false)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <dl className="info-list">
                  <div><dt>First name</dt><dd>{firstName || '—'}</dd></div>
                  <div><dt>Last name</dt><dd>{lastName || '—'}</dd></div>
                  <div><dt>Email</dt><dd>{user.email}</dd></div>
                  <div><dt>Phone</dt><dd>{row?.number || '—'}</dd></div>
                  <div><dt>Address</dt><dd>{row?.address || '—'}</dd></div>
                </dl>
              )}
            </div>

            {/* orders + bookings */}
            <div className="surface-card">
              <div className="pill-tabs small" role="tablist">
                <button type="button" role="tab" aria-selected={tab === 'orders'} className={`pill${tab === 'orders' ? ' active' : ''}`} onClick={() => setTab('orders')}>
                  Orders ({orders.length})
                </button>
                <button type="button" role="tab" aria-selected={tab === 'bookings'} className={`pill${tab === 'bookings' ? ' active' : ''}`} onClick={() => setTab('bookings')}>
                  Bookings ({reservations.length})
                </button>
              </div>

              {tab === 'orders' && (
                orders.length === 0 ? (
                  <div className="empty-mini">
                    <i className="fa-solid fa-receipt" />
                    <p>No orders yet.</p>
                    <Link to="/menu" className="link-gold">Start your first order →</Link>
                  </div>
                ) : (
                  <ul className="history">
                    {orders.map((o) => (
                      <li key={o.id}>
                        <div className="history-top">
                          <strong>{o.id}</strong>
                          <span className="status">Placed</span>
                        </div>
                        <p className="history-items">
                          {o.items.map((i) => `${i.quantity} × ${i.name}`).join(', ')}
                        </p>
                        <div className="history-bottom">
                          <span>{fmtDate(o.date)}</span>
                          <strong>{money(o.totals.total)}</strong>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              )}

              {tab === 'bookings' && (
                reservations.length === 0 ? (
                  <div className="empty-mini">
                    <i className="fa-solid fa-calendar-check" />
                    <p>No table bookings yet.</p>
                    <Link to="/book" className="link-gold">Book a table →</Link>
                  </div>
                ) : (
                  <ul className="history">
                    {reservations.map((r) => (
                      <li key={r.id}>
                        <div className="history-top">
                          <strong>{r.id}</strong>
                          <span className="status">Booked</span>
                        </div>
                        <p className="history-items">{r.persons} {Number(r.persons) === 1 ? 'person' : 'people'} · {fmtTime(r.time)}</p>
                        <div className="history-bottom">
                          <span>{fmtDate(r.date)}</span>
                          <span>{r.name}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
