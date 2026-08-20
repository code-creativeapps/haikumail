import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer, Header } from '@/components/Chrome'
import { ORIGINALS, TRANSLATIONS, slugOf } from '@/lib/haiku'

const TOTAL = ORIGINALS.length + TRANSLATIONS.length

export const metadata: Metadata = {
  title: `All ${TOTAL} haiku`,
  description: `The ${TOTAL} poems HaikuMail draws from while it holds the first thirty seconds: ${ORIGINALS.length} written for the extension, and ${TRANSLATIONS.length} translated here from public-domain Japanese originals.`,
  alternates: { canonical: '/haiku' },
}

export default function HaikuIndex() {
  return (
    <>
      <Header />
      <main className="hk-shell">
        <article className="hk-prose">
          <h1>The {TOTAL} haiku</h1>
          <p className="hk-lede">
            One of these holds the first thirty seconds, each time you open your mail.
            None of them is here to be searched for, which is rather the point — but
            they are all here to be read.
          </p>

          <h2>{TRANSLATIONS.length} translations</h2>
          <p>
            Bashō, Buson, Issa, Shiki and a few others. The Japanese originals have been
            in the public domain for centuries; the English translations that circulate
            most widely — Blyth, Henderson, Hass — are not, which is the trap in
            collecting &ldquo;famous haiku&rdquo; from the web. So these renderings were
            made here, and are labelled as machine translations wherever they appear.
            Each carries the romaji of its source so it can be checked rather than taken
            on trust.
          </p>
          <p>
            They follow the sense rather than forcing 5-7-5: Japanese counts{' '}
            <em>on</em>, not syllables, and padding a translation out to fit the shape is
            how you end up with a poem the poet did not write.
          </p>
        </article>

        <ul className="hk-haiku-grid">
          {TRANSLATIONS.map((h) => (
            <li key={slugOf(h)}>
              <Link href={`/haiku/${slugOf(h)}`}>
                <div className="hk-haiku-card">
                  {h.lines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                  <span className="hk-haiku-poet">
                    {h.poet} · AI translation
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <article className="hk-prose">
          <h2>{ORIGINALS.length} originals</h2>
          <p>
            Written for the extension, all of them 5-7-5, and shown unsigned — they are
            there to fill thirty seconds rather than to be admired.
          </p>
        </article>

        <ul className="hk-haiku-grid">
          {ORIGINALS.map((h, i) => (
            <li key={i}>
              <div className="hk-haiku-card hk-haiku-plain">
                {h.lines.map((line, j) => (
                  <p key={j}>{line}</p>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <article className="hk-prose">
          <p className="hk-dateline">
            All of them are MIT licensed, like the rest of the project. Quote them freely.
          </p>
        </article>
      </main>
      <Footer />
    </>
  )
}
