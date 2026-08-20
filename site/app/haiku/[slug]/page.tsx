import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer, Header } from '@/components/Chrome'
import { JsonLd } from '@/components/JsonLd'
import { bySlug, slugOf, TRANSLATIONS } from '@/lib/haiku'
import { poetOf } from '@/lib/poets'
import { SITE_URL } from '@/lib/site'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return TRANSLATIONS.map((h) => ({ slug: slugOf(h) }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const haiku = bySlug(slug)
  if (!haiku) return {}

  const first = haiku.lines[0].replace(/[.,—]$/, '')
  return {
    title: `${first} — ${haiku.poet}`,
    description: `${haiku.lines.join(' / ')} — ${haiku.poet}. Translated from “${haiku.romaji}”, with the romaji recorded so the rendering can be checked.`,
    alternates: { canonical: `/haiku/${slug}` },
  }
}

export default async function HaikuPage({ params }: Params) {
  const { slug } = await params
  const haiku = bySlug(slug)
  if (!haiku) notFound()

  const poet = poetOf(haiku.poet)
  const siblings = TRANSLATIONS.filter((h) => h.poet === haiku.poet && h !== haiku)

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          '@id': `${SITE_URL}/haiku/${slug}`,
          name: haiku.lines[0],
          text: haiku.lines.join('\n'),
          genre: 'Haiku',
          inLanguage: 'en',
          author: { '@type': 'Person', name: poet.name },
          translationOfWork: {
            '@type': 'CreativeWork',
            name: haiku.romaji,
            inLanguage: 'ja',
            author: { '@type': 'Person', name: poet.name },
          },
        }}
      />
      <Header />
      <main className="hk-shell">
        <article className="hk-prose hk-poem-page">
          <p className="hk-dateline">
            <Link href="/haiku">← All the haiku</Link>
          </p>

          <div className="hk-poem-solo">
            {haiku.lines.map((line, i) => (
              <p key={i} className="haiku-line" style={{ animationDelay: `${i * 700}ms` }}>
                {line}
              </p>
            ))}
            <p className="hk-attribution">— {haiku.poet} · AI translation</p>
          </div>

          <h2>The original</h2>
          <p className="hk-romaji">{haiku.romaji}</p>
          <p>
            That is the source, in romaji. It is printed here rather than kept in a
            footnote because the English above is machine-made, not a scholar&rsquo;s, and
            you should be able to check it against something rather than take it on trust.
          </p>
          <p>
            The rendering follows the sense rather than forcing 5-7-5. Japanese counts{' '}
            <em>on</em> rather than syllables, and the two do not line up; padding a
            translation out to fit the English shape is how you end up with a poem the
            poet did not write.
          </p>

          <h2>
            {poet.name}
            {poet.dates && <span className="hk-poet-dates"> {poet.dates}</span>}
          </h2>
          <p>{poet.note}</p>

          {siblings.length > 0 && (
            <>
              <h2>
                {siblings.length === 1
                  ? `One more from ${haiku.poet}`
                  : `${siblings.length} more from ${haiku.poet}`}
              </h2>
              <ul className="hk-sibling-list">
                {siblings.map((h) => (
                  <li key={slugOf(h)}>
                    <Link href={`/haiku/${slugOf(h)}`}>{h.lines.join(' / ')}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <h2>Why this is here at all</h2>
          <p>
            HaikuMail is a Chrome extension that hides your inbox behind a search-only
            reader, and holds the first thirty seconds with a poem. This is one of the 157
            it draws from. <Link href="/">That is the rest of the story</Link>.
          </p>
        </article>
      </main>
      <Footer />
    </>
  )
}
