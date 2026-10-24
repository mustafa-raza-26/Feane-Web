import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { client, SUPABASE_NOT_CONFIGURED_MESSAGE } from '../lib/supabase.js'
import { isEmail } from '../lib/validate.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function SignIn() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to="/profile" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    if (!isEmail(email)) return setMessage('Please enter a valid email address.')
    if (!password) return setMessage('Please enter your password.')
    if (!client) return setMessage(SUPABASE_NOT_CONFIGURED_MESSAGE)

    setBusy(true)
    const { error } = await client.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (error) return setMessage(error.message)

    toast.success('Welcome back!')
    navigate('/')
    return undefined
  }

  return (
    <div className="auth-shell">
      <div className="container">
        <div className="auth-card">
          <aside className="auth-aside">
            <span className="eyebrow">Welcome back</span>
            <h2>Hungry again? <em>We're ready.</em></h2>
            <p>Sign in to order online, track your orders and manage your profile.</p>
          </aside>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <h1>Sign in</h1>
            <p className="auth-sub">Enter your details to continue.</p>

            <div className="field">
              <label htmlFor="email">Email</label>
              <div className="input-icon">
                <i className="fa-regular fa-envelope" />
                <input id="email" className="input" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-icon">
                <i className="fa-solid fa-lock" />
                <input id="password" className="input" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" className="reveal-pw" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>

            {message && <div className="form-alert" role="alert"><i className="fa-solid fa-circle-exclamation" /> {message}</div>}

            <button type="submit" className="pbtn pbtn-gold pbtn-block" id="signin" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>

            <p className="auth-switch">New to Feane? <Link to="/signup">Create an account</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}
