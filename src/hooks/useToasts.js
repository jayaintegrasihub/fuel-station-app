import { useState, useCallback } from 'react'

export function useToasts() {
  const [toasts, setToasts] = useState([])
  const push = useCallback((type, title, sub) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, type, title, sub }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])
  return { toasts, push }
}
