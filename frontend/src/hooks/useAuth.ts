// lib/useAuth.ts
import { useState, useEffect } from 'react'

export function useAuth() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // check localStorage or call API
    const saved = localStorage.getItem('user')
    if (saved) setUser(JSON.parse(saved))
    setLoading(false)
  }, [])

  return { user, loading }
}