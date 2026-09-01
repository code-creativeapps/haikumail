/**
 * The writing section.
 *
 * The route, the index and the sitemap all read from this array, so adding an
 * entry plus its page under `app/notes/<slug>/` is the whole of publishing one.
 * Newest first; the index and the sitemap both rely on that order.
 */
export type Note = {
  slug: string
  title: string
  description: string
  /** ISO date. */
  published: string
}

export const NOTES: Note[] = [
  {
    slug: 'reading-gmail-without-oauth',
    title: 'Reading Gmail without OAuth',
    description:
      'A content script in the tab you are already signed into can read your mail without a token, a scope screen or a server. Here is how, and the five things that bite you.',
    published: '2026-09-01',
  },
  {
    slug: 'where-famous-haiku-translations-come-from',
    title: 'Where “famous haiku” translations come from',
    description:
      'The poems are centuries old and long out of copyright. The English versions you have read are not — and that is why HaikuMail ships fifty-seven of its own.',
    published: '2026-09-01',
  },
]

export const noteBySlug = (slug: string): Note | undefined =>
  NOTES.find((n) => n.slug === slug)
