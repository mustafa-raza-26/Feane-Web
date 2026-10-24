import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { client } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

// "Order Online": go to the menu when signed in, otherwise open the login prompt.
// Used by the navbar and every "Order" button on the home page.
export function useOrderOnline() {
  const navigate = useNavigate()
  const { openLogin } = useAuth()

  return useCallback(async () => {
    if (client) {
      const { data } = await client.auth.getSession()
      if (data.session) {
        navigate('/menu')
        return
      }
    }
    openLogin()
  }, [navigate, openLogin])
}
