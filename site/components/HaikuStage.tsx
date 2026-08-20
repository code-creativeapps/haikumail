'use client'

import { useEffect, useState } from 'react'
import { drawHaiku, isTranslation, OPENING_HAIKU, type Haiku } from '@/lib/haiku'

/**
 * The hero reproduces the thing itself: a poem arriving line by line, and a
 * countdown you cannot skip. It is the rare product whose landing page can show
 * the whole experience with nothing lost in the telling.
 *
 * The first render — server and first client paint alike — is always
 * OPENING_HAIKU. The page is statically generated, so a random pick on the
 * server would be frozen at build time and become the poem every crawler and
 * every link preview sees forever; and picking randomly during render would
 * disagree with the server's HTML and blow up hydration. So: a chosen poem in
 * the HTML, a real draw once we are safely past mount.
 */
export function HaikuStage({ seconds = 30 }: { seconds?: number }) {
  const [haiku, setHaiku] = useState<Haiku>(OPENING_HAIKU)
  const [left, setLeft] = useState(seconds)

  useEffect(() => {
    setHaiku(drawHaiku(OPENING_HAIKU))
  }, [])

  useEffect(() => {
    if (left <= 0) return
    const id = setTimeout(() => setLeft((n) => n - 1), 1000)
    return () => clearTimeout(id)
  }, [left])

  const done = left <= 0

  return (
    <div className="hk-stage">
      {/* Re-keying restarts the staggered entrance when the poem changes. */}
      <div key={haiku.lines.join('|')} className="hk-poem">
        {haiku.lines.map((line, i) => (
          <p key={i} className="haiku-line" style={{ animationDelay: `${i * 900}ms` }}>
            {line}
          </p>
        ))}
        {isTranslation(haiku) && (
          <p className="hk-attribution" title={haiku.romaji}>
            — {haiku.poet} · AI translation
          </p>
        )}
      </div>

      <div className="hk-countdown" aria-live="off">
        <div className="hk-countdown-track">
          <div
            className="hk-countdown-fill"
            style={{ width: `${((seconds - left) / seconds) * 100}%` }}
          />
        </div>
        <span className="hk-countdown-label">
          {done ? 'go on, then' : `0:${String(left).padStart(2, '0')}`}
        </span>
      </div>
      {done && (
        <button className="hk-again" type="button" onClick={() => { setHaiku(drawHaiku(haiku)); setLeft(seconds) }}>
          Another
        </button>
      )}
    </div>
  )
}
