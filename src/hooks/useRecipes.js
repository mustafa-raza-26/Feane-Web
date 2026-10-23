import { useEffect, useState } from 'react'

const API = 'https://dummyjson.com/recipes'

// One shared request for the whole app (Home + Menu both use the same list).
let recipesPromise = null

function loadRecipes() {
  if (!recipesPromise) {
    recipesPromise = fetch(API)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        return res.json()
      })
      .then((data) => data.recipes)
      .catch((err) => {
        recipesPromise = null // allow a retry next time
        throw err
      })
  }
  return recipesPromise
}

export function useRecipes() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    loadRecipes()
      .then((list) => {
        if (!cancelled) {
          setRecipes(list)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { recipes, loading, error }
}
