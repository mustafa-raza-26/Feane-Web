import { useCallback, useEffect, useState } from 'react'

const API = 'https://dummyjson.com/recipes?limit=0' // limit=0 -> every recipe, not just the first 30

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
        recipesPromise = null // allow a retry
        throw err
      })
  }
  return recipesPromise
}

export function useRecipes() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    loadRecipes()
      .then((list) => {
        if (!cancelled) {
          setRecipes(list)
          setError(null)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Something went wrong')
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    setAttempt((n) => n + 1)
  }, [])

  return { recipes, loading, error, retry }
}
