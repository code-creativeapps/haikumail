import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer, Header } from '@/components/Chrome'
import { JsonLd } from '@/components/JsonLd'
import { noteBySlug } from '@/lib/notes'
import { SITE_URL } from '@/lib/site'

const note = noteBySlug('where-famous-haiku-translations-come-from')!

export const metadata: Metadata = {
  title: note.title,
  description: note.description,
  alternates: { canonical: `/notes/${note.slug}` },
  openGraph: { type: 'article', publishedTime: note.published },
}

export default function Note() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          '@id': `${SITE_URL}/notes/${note.slug}`,
          headline: note.title,
          description: note.description,
          datePublished: note.published,
          inLanguage: 'en',
          author: { '@type': 'Organization', name: 'HaikuMail' },
        }}
      />
      <Header />
      <main className="hk-shell hk-prose hk-narrow">
        <h1>{note.title}</h1>
        <p className="hk-note-meta">
          <time dateTime={note.published}>1 September 2026</time>
        </p>

        <p>
          Bashō died in 1694. Buson in 1783, Issa in 1828, Shiki in 1902. Their poems
          have been out of copyright for longer than copyright law has looked anything
          like its present shape. You can print them, sell them, carve them into a
          bench.
        </p>
        <p>
          The English versions are a different matter, and this catches almost everyone
          out. <strong>A translation is a new creative work.</strong> Choosing{' '}
          <em>old pond</em> over <em>ancient pool</em>, deciding whether the frog jumps
          or leaps, whether the third line ends in a full stop or nothing at all — those
          are authorial decisions, and the law treats them as such. The translator holds
          a copyright in the translation even though nobody holds one in the poem.
        </p>
        <p>
          Which means the famous English haiku — the ones that turn up on posters, in
          school anthologies, at the top of search results — are mostly still owned by
          somebody.
        </p>

        <h2>Who owns the ones you have read</h2>
        <p>
          Three names account for most of the haiku that reached English readers.{' '}
          <strong>R. H. Blyth</strong> (1898–1964) published his four-volume{' '}
          <em>Haiku</em> between 1949 and 1952, and it is the reason the form is known
          in the West at all — it is where the Beat poets found it.{' '}
          <strong>Harold G. Henderson</strong> (1889–1974) wrote the introduction that
          taught a generation to read them. <strong>Robert Hass</strong>, born 1941,
          edited <em>The Essential Haiku</em> in 1994, which is the version most people
          under fifty have actually held.
        </p>
        <p>
          In most of the world copyright runs for the author&rsquo;s life plus seventy
          years. Blyth&rsquo;s work is therefore protected into the 2030s,
          Henderson&rsquo;s into the 2040s, and Hass&rsquo;s for a good deal longer than
          that. The exact term depends where you are and when the thing was first
          published, but the short version holds everywhere: these translations are not
          free to use, and the great majority of the sites reproducing them are doing it
          without permission.
        </p>

        <h2>So we translated them ourselves</h2>
        <p>
          HaikuMail shows a poem while it holds your inbox for thirty seconds. A hundred
          of them were written for the extension. The other fifty-seven are new
          translations of the classical poets, made because the alternative was either
          to use somebody else&rsquo;s work without asking or to leave the classical
          poems out entirely.
        </p>
        <p>
          Beside each translation the site records the{' '}
          <strong>romaji</strong> — the Japanese original in Latin script. That is not
          decoration. It is the thing that lets you check the work:
        </p>
        <p className="hk-quote">
          furuike ya / kawazu tobikomu / mizu no oto
          <br />
          <span>An old pond. / A frog jumps in. / The sound of water.</span>
        </p>
        <p>
          A haiku translator gives something up, always. The Japanese is seventeen{' '}
          <em>on</em> — sound units, not quite syllables — in a 5-7-5 shape that English
          cannot hold without padding. There is a <em>kireji</em>, a cutting word, doing
          work that English punctuation only approximates; the <em>ya</em> in the line
          above is one, and the full stop after &ldquo;pond&rdquo; is the best we could
          do with it. There is usually a season word, and it usually carries more than
          the season.
        </p>
        <p>
          Ours lean plain. Where a choice existed between the pretty phrase and the one
          that says what the poem says, we took the second. That is a preference rather
          than a claim to authority — we are not scholars, and the romaji is published
          precisely so you do not have to take our word for any of it.
        </p>

        <h2>Why this is on a page about email</h2>
        <p>
          Because it is the sort of thing that is easy to get away with and we would
          rather not. An extension that puts a poem in front of your inbox and quietly
          lifted the poem would be a strange thing to trust with anything else.
        </p>
        <p>
          All 157 are on <Link href="/haiku">the haiku page</Link>, with the fifty-seven
          translations each on a page of their own alongside the original.
        </p>
      </main>
      <Footer />
    </>
  )
}
