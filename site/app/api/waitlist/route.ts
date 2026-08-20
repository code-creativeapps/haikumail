import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/site'

export const runtime = 'nodejs'

/**
 * The waitlist.
 *
 * Checks run cheapest-first, and none of them tells a caller why it failed —
 * a bot that learns which check caught it is a bot that gets past it next time.
 * Rate limiting is deliberately absent from this file: it is configured as a
 * Vercel Firewall rule on this path, so it runs before the function is even
 * invoked and no IP address ever reaches our code.
 *
 * Requires BUTTONDOWN_API_KEY. Buttondown is set to double opt-in, which is
 * what makes it safe to accept an address from a stranger: an unconfirmed
 * address never receives anything, so the form cannot be used to send mail to
 * someone who did not ask for it.
 */

const ok = () => NextResponse.json({ ok: true })
const fail = (error: string, status = 400) =>
  NextResponse.json({ ok: false, error }, { status })

/** Conservative: this is a gate, not a parser. */
const LOOKS_LIKE_EMAIL = /^[^\s@,;:<>()[\]\\]+@[^\s@.]+(\.[^\s@.]+)+$/

function allowedOrigin(origin: string | null): boolean {
  if (!origin) return false
  if (origin === SITE_URL) return true
  // Preview deploys, so the form is testable before it is live.
  try {
    const { hostname, protocol } = new URL(origin)
    return protocol === 'https:' && hostname.endsWith('.vercel.app')
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (!allowedOrigin(request.headers.get('origin'))) {
    return fail('Not allowed.', 403)
  }

  // A cross-origin form post cannot set this header without a preflight, so
  // requiring it rules out the simplest kind of drive-by submission.
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return fail('Not allowed.', 415)
  }

  let body: { email?: unknown; website?: unknown; elapsed?: unknown }
  try {
    body = await request.json()
  } catch {
    return fail('That did not look like a request we understand.')
  }

  // Honeypot. Answer as though it worked: never confirm a rejection.
  if (typeof body.website === 'string' && body.website.trim() !== '') return ok()

  // Nobody reads the label and types an address in under two seconds.
  if (typeof body.elapsed === 'number' && body.elapsed < 2000) return ok()

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || email.length > 254 || !LOOKS_LIKE_EMAIL.test(email)) {
    return fail('That address does not look quite right.')
  }

  const key = process.env.BUTTONDOWN_API_KEY
  if (!key) {
    console.error('waitlist: BUTTONDOWN_API_KEY is not set')
    return fail('The list is not accepting signups just now. Try again later.', 503)
  }

  try {
    const res = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Token ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address: email, type: 'unactivated' }),
    })

    // An address already on the list gets the same answer as a new one. Saying
    // "you are already subscribed" would turn the form into a way of testing
    // whether a given person is on it.
    if (res.ok || res.status === 409) return ok()

    console.error('waitlist: buttondown responded', res.status, await res.text())
    return fail('That did not work. Try again in a moment.', 502)
  } catch (error) {
    console.error('waitlist: request failed', error)
    return fail('That did not work. Try again in a moment.', 502)
  }
}
