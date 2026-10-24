import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { client } from '../lib/supabase.js'
import LoginModal from '../components/LoginModal.jsx'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(Boolean(client))
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    if (!client) return undefined
    let active = true

    client.auth
      .getSession()
      .then(({ data }) => {
        if (active) setSession(data.session)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })

    const { data } = client.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const openLogin = useCallback(() => setLoginOpen(true), [])
  const closeLogin = useCallback(() => setLoginOpen(false), [])
  const signOut = useCallback(async () => {
    if (!client) return { error: null }
    return client.auth.signOut({ scope: 'local' })
  }, [])

  const value = useMemo(
    () => ({ session, user: session?.user ?? null, loading, openLogin, closeLogin, signOut }),
    [session, loading, openLogin, closeLogin, signOut],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginModal show={loginOpen} onClose={closeLogin} />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
