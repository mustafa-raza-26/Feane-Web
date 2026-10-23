import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { client, SUPABASE_NOT_CONFIGURED_MESSAGE } from '../lib/supabase.js'

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | signedOut | error
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProfile() {
      if (!client) {
        setErrorMessage(SUPABASE_NOT_CONFIGURED_MESSAGE)
        setStatus('error')
        return
      }

      const { data, error } = await client.auth.getSession()
      if (cancelled) return
      if (error) {
        setErrorMessage(error.message)
        setStatus('error')
        return
      }
      if (!data.session) {
        setStatus('signedOut')
        return
      }

      const { data: rows, error: fetchError } = await client
        .from('user_food')
        .select('firstName, lastName, email')
        .eq('uid', data.session.user.id)
        .order('created_at', { ascending: false })
      if (cancelled) return

      if (fetchError) {
        setErrorMessage(fetchError.message)
        setStatus('error')
        return
      }
      setProfile(rows?.[0] ?? null) // most recent row
      setStatus('ready')
    }

    loadProfile()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleLogout() {
    if (!client) return
    const { error } = await client.auth.signOut({ scope: 'local' })
    if (error) {
      alert(error.message)
    } else {
      alert('Logout successfully!')
      navigate('/')
    }
  }

  return (
    <div className="auth-page">
      <PageHeader />

      <div className="container">
        <div className="row">
          <div id="user">
            {status === 'loading' && <span>Loading…</span>}
            {status === 'signedOut' && <span>You are not signed in.</span>}
            {status === 'error' && <span className="text-danger">{errorMessage}</span>}
            {status === 'ready' && profile && (
              <>
                <span>Name: {profile.firstName} {profile.lastName}</span>
                <div>Email: {profile.email}</div>
              </>
            )}
            {status === 'ready' && !profile && <span>No profile data found.</span>}
          </div>
        </div>
      </div>

      <button id="logout" onClick={handleLogout}>logout</button>
    </div>
  )
}
