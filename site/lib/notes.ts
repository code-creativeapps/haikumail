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
    slug: 'hide-the-unread-count-in-gmail',
    title: 'How to hide the unread count in Gmail',
    description:
      'Two settings remove the badge and change what the number counts. Neither touches the tab title, which is the one most people are actually bothered by. Checked against Gmail in September 2026.',
    published: '2026-09-01',
  },
  {
    slug: 'why-a-thirty-second-wait-works',
    title: 'Why a thirty-second wait works when a blocker doesn’t',
    description:
      'Blockers ask you to be disciplined at the exact moment you have none left. A delay asks for nothing, and that is why it survives contact with a bad afternoon.',
    published: '2026-09-01',
  },
  {
    slug: 'what-the-extension-can-and-cannot-see',
    title: 'What the extension can and cannot see',
    description:
      'The privacy claim in long form: the manifest read line by line, what is stored, what is not, and how to check all of it yourself.',
    published: '2026-09-01',
  },
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
