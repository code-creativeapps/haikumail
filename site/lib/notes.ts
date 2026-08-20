/**
 * The writing section. Empty on purpose right now.
 *
 * Five pieces are planned, and the first — an honest, complete answer to "how
 * do I hide the unread count in Gmail" — is the best organic target the site
 * has: real recurring volume, and the current results are decade-old forum
 * threads. But a how-to that is confidently wrong is worse than no how-to,
 * and worse for the domain than publishing nothing, so nothing goes here until
 * the steps have actually been checked against Gmail.
 *
 * The route, the index and the sitemap all read from this array, so adding an
 * entry plus its page is the whole of publishing one.
 */
export type Note = {
  slug: string
  title: string
  description: string
  /** ISO date. */
  published: string
}

export const NOTES: Note[] = []

export const noteBySlug = (slug: string): Note | undefined =>
  NOTES.find((n) => n.slug === slug)
