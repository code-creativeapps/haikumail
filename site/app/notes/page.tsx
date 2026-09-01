import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer, Header } from '@/components/Chrome'
import { NOTES } from '@/lib/notes'

export const metadata: Metadata = {
  title: 'Notes',
  description:
    'Occasional writing about email, attention, and the small technical decisions behind HaikuMail.',
  alternates: { canonical: '/notes' },
}

const readable = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

export default function NotesPage() {
  return (
    <>
      <Header />
      <main className="hk-shell hk-prose hk-narrow">
        <h1>Notes</h1>
        <p>
          Occasional writing about email, attention, and the small technical decisions
          behind HaikuMail.
        </p>
        <ul className="hk-note-list">
          {NOTES.map((note) => (
            <li key={note.slug}>
              <h2>
                <Link href={`/notes/${note.slug}`}>{note.title}</Link>
              </h2>
              <p>{note.description}</p>
              <time dateTime={note.published}>{readable(note.published)}</time>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  )
}
