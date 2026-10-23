import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { client, SUPABASE_NOT_CONFIGURED_MESSAGE } from '../lib/supabase.js'

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  // Sign in with email & password (Supabase Auth)
  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    if (!client) {
      setMessage(SUPABASE_NOT_CONFIGURED_MESSAGE)
      return
    }
    setBusy(true)
    const { error } = await client.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) {
      setMessage(error.message)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="auth-page">
      <PageHeader />

      <form className="form" onSubmit={handleSubmit}>
        <div className="container">
          <div className="row p-3 email text-center">
            <div className="col-12 col-md-12 p-3 mail">
              Email:
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="col-12 col-md-12 p-3 pass">
              Password:
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          {message && <p className="text-center text-danger">{message}</p>}

          <div className="text-center mt-2 p-3">
            <button type="submit" className="col-8 col-md-3 col-lg-2" id="signin" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign In'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
