/**
 * Browse: reading by kind rather than by search term.
 *
 * Every filter here resolves to a Gmail query and goes through the same
 * `search()` the search box uses — Browse adds no new plumbing, only names for
 * queries worth having. Three kinds of filter, in descending order of how much
 * Gmail does for us:
 *
 * 1. A plain operator (`is:starred`, `category:social`).
 *
 * 2. Gmail's own classifier, via its undocumented smart labels
 *    (`label:^smartlabel_newsletter`). These are not in Google's documentation
 *    and could be withdrawn, but they are real: an invented one
 *    (`^smartlabel_zzznonsense`) returns zero results rather than being
 *    ignored, which is how we know Gmail is actually evaluating them. Where a
 *    documented `category:` operator covers the same ground it is kept as a
 *    fallback — see `fallback`.
 *
 * 3. A set of senders, compiled into `from:(a OR b OR …)`. Gmail has no notion
 *    of a favourite *sender*, so we derive one: the people whose mail you have
 *    starred. The same mechanism backs Sales and Shopping, which Gmail cannot
 *    tell apart on its own — those are sender sets you build by tagging.
 *
 * Measured against a real inbox: a 45-sender query is 1,553 encoded characters
 * and returns in ~3s, so `SENDER_CAP` is set well inside what works.
 */

import { search, type Row } from '../lib/gmail'

export type FilterId =
  | 'starred'
  | 'favorite-senders'
  | 'newsletters'
  | 'notifications'
  | 'social'
  | 'promotions'
  | 'sales'
  | 'shopping'

export type Filter = {
  id: FilterId
  label: string
  /** Shown when the filter is empty, so an empty screen still explains itself. */
  hint: string
  /** A fixed query, or a sender set to compile. */
  query?: string
  /** Used if `query` returns nothing — the documented operator for the same idea. */
  fallback?: string
  senders?: 'starred' | 'tagged'
  tag?: SenderTag
}

export const FILTERS: readonly Filter[] = [
  {
    id: 'starred',
    label: 'Favourites',
    query: 'is:starred',
    hint: 'Mail you have starred in Gmail shows up here.',
  },
  {
    id: 'favorite-senders',
    label: 'Favourite senders',
    senders: 'starred',
    hint: 'Star a few emails in Gmail and everyone you starred becomes a favourite sender.',
  },
  {
    id: 'newsletters',
    label: 'Newsletters',
    query: 'label:^smartlabel_newsletter',
    fallback: 'category:updates',
    hint: 'Gmail did not classify anything as a newsletter.',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    query: 'label:^smartlabel_notification',
    fallback: 'category:updates',
    hint: 'Nothing from apps and services right now.',
  },
  {
    id: 'social',
    label: 'Social',
    query: 'category:social',
    hint: 'Nothing from social networks right now.',
  },
  {
    id: 'promotions',
    label: 'Promotions',
    query: 'label:^smartlabel_promo',
    fallback: 'category:promotions',
    hint: 'Everything trying to sell you something. Tag the senders to split them.',
  },
  {
    id: 'sales',
    label: 'Sales',
    senders: 'tagged',
    tag: 'sales',
    hint: 'Programmes, coaching, courses. Gmail cannot pick these out, so this list is yours to build: open Promotions and tag a sender as Sales.',
  },
  {
    id: 'shopping',
    label: 'Shopping',
    senders: 'tagged',
    tag: 'shop',
    hint: 'Physical products. Open Promotions and tag a sender as Shopping to fill this in.',
  },
]

/* ── Sender tags ─────────────────────────────────────────────────────────── */

export type SenderTag = 'sales' | 'shop'

const TAGS_KEY = 'haikumail:sender-tags'

export type SenderTags = Record<string, SenderTag>

export function loadTags(): SenderTags {
  try {
    return JSON.parse(localStorage.getItem(TAGS_KEY) ?? '{}') as SenderTags
  } catch {
    return {}
  }
}

export function setTag(email: string, tag: SenderTag | null): SenderTags {
  const tags = loadTags()
  if (tag) tags[email] = tag
  else delete tags[email]
  localStorage.setItem(TAGS_KEY, JSON.stringify(tags))
  return tags
}

/* ── Favourite senders ───────────────────────────────────────────────────── */

/**
 * Gmail's search box takes a long query happily, but there is no reason to
 * push it: past a few dozen senders the tail is people you starred once.
 */
const SENDER_CAP = 40

const FAVORITES_KEY = 'haikumail:favorite-senders'
const FAVORITES_TTL_MS = 12 * 60 * 60 * 1000

type CachedSenders = { at: number; senders: string[] }

/**
 * The people whose mail you star, most-starred first.
 *
 * This costs a full search of `is:starred`, so it is cached for half a day —
 * long enough that switching to this filter is instant, short enough that
 * newly starred senders turn up the same day.
 */
export async function favoriteSenders(force = false): Promise<string[]> {
  if (!force) {
    try {
      const cached = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? 'null') as CachedSenders | null
      if (cached && Date.now() - cached.at < FAVORITES_TTL_MS) return cached.senders
    } catch {
      // fall through and recompute
    }
  }

  const starred = await search('is:starred')
  const counts = new Map<string, number>()
  for (const row of starred) {
    if (row.email) counts.set(row.email, (counts.get(row.email) ?? 0) + 1)
  }
  const senders = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, SENDER_CAP)
    .map(([email]) => email)

  localStorage.setItem(FAVORITES_KEY, JSON.stringify({ at: Date.now(), senders } satisfies CachedSenders))
  return senders
}

const fromAny = (senders: string[]) => `from:(${senders.join(' OR ')})`

export type FilterResult = { rows: Row[]; senderCount?: number }

/** Resolve a filter to rows, whichever of the three kinds it is. */
export async function runFilter(filter: Filter, tags: SenderTags): Promise<FilterResult> {
  if (filter.senders === 'starred') {
    const senders = await favoriteSenders()
    if (!senders.length) return { rows: [], senderCount: 0 }
    return { rows: await search(fromAny(senders)), senderCount: senders.length }
  }

  if (filter.senders === 'tagged') {
    const senders = Object.entries(tags)
      .filter(([, tag]) => tag === filter.tag)
      .map(([email]) => email)
      .slice(0, SENDER_CAP)
    if (!senders.length) return { rows: [], senderCount: 0 }
    return { rows: await search(fromAny(senders)), senderCount: senders.length }
  }

  const rows = await search(filter.query!)
  // A smart label Google has since withdrawn would look exactly like an empty
  // inbox, so fall back to the documented operator before believing it.
  if (!rows.length && filter.fallback) return { rows: await search(filter.fallback) }
  return { rows }
}
