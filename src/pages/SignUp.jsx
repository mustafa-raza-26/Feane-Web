import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { client, SUPABASE_NOT_CONFIGURED_MESSAGE } from '../lib/supabase.js'
import { isEmail, isPhone } from '../lib/validate.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const EMPTY = { firstName: '', lastName: '', email: '', password: '', number: '', address: '' }

export default function SignUp() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuth()
  const [form, setForm] = useState(EMPTY)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to="/profile" replace />

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  function validate() {
    if (form.firstName.trim().length < 2) return 'Please enter your first name.'
    if (!isEmail(form.email)) return 'Please enter a valid email address.'
    if (form.password.length < 6) return 'Password must be at least 6 characters.'
    if (form.number && !isPhone(form.number)) return 'Please enter a valid phone number.'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    const problem = validate()
    if (problem) return setMessage(problem)
    if (!client) return setMessage(SUPABASE_NOT_CONFIGURED_MESSAGE)

    setBusy(true)

    // 1) create the auth user
    const { data, error } = await client.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: { data: { first_name: form.firstName.trim() } },
    })
    if (error) {
      setBusy(false)
      return setMessage(error.message)
    }

    // If email confirmation is switched on in Supabase there is no session yet,
    // so the profile row can't be written now (the profile page creates it later).
    if (!data.session) {
      setBusy(false)
      toast.info('Account created. Please confirm your email, then sign in.')
      navigate('/signin')
      return undefined
    }

    // 2) save the profile row. The password is NOT stored here – Supabase Auth keeps it (hashed).
    const { error: dbError } = await client.from('user_food').insert({
      uid: data.user?.id,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
      number: form.number,
      address: form.address.trim(),
    })
    setBusy(false)
    if (dbError) toast.error(`Account created, but the profile could not be saved: ${dbError.message}`)
    else toast.success('Account created successfully!')

    navigate('/')
    return undefined
  }

  return (
    <div className="auth-shell">
      <div className="container">
        <div className="auth-card">
          <aside className="auth-aside">
            <span className="eyebrow">Join Feane</span>
            <h2>Your next meal is <em>a few taps away.</em></h2>
            <p>Create a free account to order online, save your details and keep track of every order.</p>
          </aside>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <h1>Create account</h1>
            <p className="auth-sub">It only takes a minute.</p>

            <div className="form-grid">
              <div className="field">
                <label htmlFor="first_Name">First name</label>
                <input id="first_Name" className="input" type="text" autoComplete="given-name" value={form.firstName} onChange={set('firstName')} />
              </div>
              <div className="field">
                <label htmlFor="last_Name">Last name</label>
                <input id="last_Name" className="input" type="text" autoComplete="family-name" value={form.lastName} onChange={set('lastName')} />
              </div>
              <div className="field full">
                <label htmlFor="email">Email</label>
                <div className="input-icon">
                  <i className="fa-regular fa-envelope" />
                  <input id="email" className="input" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
                </div>
              </div>
              <div className="field full">
                <label htmlFor="password">Password</label>
                <div className="input-icon">
                  <i className="fa-solid fa-lock" />
                  <input id="password" className="input" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="At least 6 characters" value={form.password} onChange={set('password')} />
                  <button type="button" className="reveal-pw" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
              </div>
              <div className="field">
                <label htmlFor="number">Phone <span className="optional">(optional)</span></label>
                <input id="number" className="input" type="tel" autoComplete="tel" value={form.number} onChange={set('number')} />
              </div>
              <div className="field">
                <label htmlFor="address">Address <span className="optional">(optional)</span></label>
                <input id="address" className="input" type="text" autoComplete="street-address" value={form.address} onChange={set('address')} />
              </div>
            </div>

            {message && <div className="form-alert" role="alert"><i className="fa-solid fa-circle-exclamation" /> {message}</div>}

            <button type="submit" className="pbtn pbtn-gold pbtn-block" id="create_Account" disabled={busy}>
              {busy ? 'Creating account…' : 'Create account'}
            </button>

            <p className="auth-switch">Already have an account? <Link to="/signin">Sign in</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}
