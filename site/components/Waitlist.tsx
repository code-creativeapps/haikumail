'use client'

import { useEffect, useRef, useState } from 'react'
import { CONTACT_EMAIL } from '@/lib/site'

type State = 'idle' | 'sending' | 'sent' | 'error'

export function Waitlist() {
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState('')
  const mountedAt = useRef(0)

  // Recorded on the client so the handler can reject submissions that arrive
  // implausibly fast. A human cannot read the label and type an address in
  // under two seconds; a script does it in twenty milliseconds.
  useEffect(() => {
    mountedAt.current = Date.now()
  }, [])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setState('sending')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email'),
          website: form.get('website'), // honeypot
          elapsed: Date.now() - mountedAt.current,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setState('sent')
      } else {
        setState('error')
        setMessage(data.error ?? 'That did not work. Try again in a moment.')
      }
    } catch {
      setState('error')
      setMessage('That did not work. Try again in a moment.')
    }
  }

  if (state === 'sent') {
    return (
      <div className="hk-waitlist-done" role="status">
        <p>
          <strong>Check your inbox.</strong> There is a message there asking you to
          confirm — which is, admittedly, a slightly awkward thing for us to ask.
        </p>
      </div>
    )
  }

  return (
    <form className="hk-waitlist" onSubmit={onSubmit}>
      <div className="hk-waitlist-row">
        <label className="hk-visually-hidden" htmlFor="waitlist-email">
          Email address
        </label>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          disabled={state === 'sending'}
        />
        {/* Not display:none — some bots skip hidden fields but fill this one. */}
        <div className="hk-honeypot" aria-hidden="true">
          <label htmlFor="waitlist-website">Leave this empty</label>
          <input id="waitlist-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <button type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'One moment' : 'Keep me posted'}
        </button>
      </div>

      <p className="hk-waitlist-consent">
        One email, when there is something to say. Your address is stored with Buttondown
        and nothing else — no name, no tracking. Unsubscribe or delete at any time, or
        write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      {state === 'error' && (
        <p className="hk-waitlist-error" role="alert">
          {message}
        </p>
      )}
    </form>
  )
}
