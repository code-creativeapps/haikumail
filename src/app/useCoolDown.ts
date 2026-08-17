import { useEffect, useState } from 'react'

/**
 * The pause. Nothing in the UI is interactive until this reaches zero.
 *
 * It is deliberately restarted on every page load: reloading Gmail to get past
 * the wait costs you the full wait again.
 */
export function useCoolDown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    const startedAt = Date.now()
    const id = setInterval(() => {
      const left = Math.max(0, seconds - Math.floor((Date.now() - startedAt) / 1000))
      setRemaining(left)
      if (left === 0) clearInterval(id)
    }, 200)
    return () => clearInterval(id)
  }, [seconds])

  return { remaining, locked: remaining > 0, progress: ((seconds - remaining) / seconds) * 100 }
}
